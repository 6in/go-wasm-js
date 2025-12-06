package main

import (
    "flag"
    "fmt"
    "log"
    "os"
    "os/exec"
    "path/filepath"
    "strings"
    "time"
    
    "github.com/second-state/WasmEdge-go/wasmedge"
)

type ETLConfig struct {
    InputFile  string `json:"inputFile"`
    OutputFile string `json:"outputFile"`
    ScriptPath string `json:"scriptPath"`
}

func compileTypeScript(tsFile string) (string, error) {
    fmt.Printf("📝 Compiling TypeScript: %s\n", tsFile)
    
    // コンパイル先ディレクトリ作成
    compiledDir := "compiled"
    if err := os.MkdirAll(compiledDir, 0755); err != nil {
        return "", err
    }
    
    // tsconfig.jsonの存在確認
    tsconfigPath := "tsconfig.json"
    var cmd *exec.Cmd
    
    if _, err := os.Stat(tsconfigPath); err == nil {
        // tsconfig.jsonが存在する場合、それを使用
        // 注意: --projectオプションとファイル名は同時に指定できないため、
        // tsconfig.jsonの設定に従ってコンパイル（includeで指定されたファイルが対象）
        fmt.Printf("📋 Using tsconfig.json\n")
        cmd = exec.Command("npx", "tsc", "--project", tsconfigPath)
    } else {
        // tsconfig.jsonが存在しない場合、デフォルト設定を使用
        fmt.Printf("📋 Using default TypeScript settings (tsconfig.json not found)\n")
        cmd = exec.Command("npx", "tsc", 
            tsFile,
            "--target", "ES2020",
            "--module", "ES2020", 
            "--outDir", compiledDir,
            "--moduleResolution", "node")
    }
    
    if output, err := cmd.CombinedOutput(); err != nil {
        return "", fmt.Errorf("TypeScript compilation failed: %v\nOutput: %s", err, output)
    }
    
    // 出力ファイルパス生成
    // tsconfig.jsonを使う場合、outDirの設定に従う
    baseName := strings.TrimSuffix(filepath.Base(tsFile), ".ts")
    jsFile := filepath.Join(compiledDir, baseName + ".js")
    
    // ファイルが実際に存在するか確認
    if _, err := os.Stat(jsFile); os.IsNotExist(err) {
        // tsconfig.jsonを使った場合、ファイル構造が異なる可能性がある
        // 相対パスから推測
        relPath, _ := filepath.Rel("scripts", tsFile)
        jsFile = filepath.Join(compiledDir, strings.TrimSuffix(relPath, ".ts")+".js")
        
        // それでも見つからない場合はエラー
        if _, err := os.Stat(jsFile); os.IsNotExist(err) {
            return "", fmt.Errorf("compiled JavaScript file not found: %s (expected: %s)", jsFile, filepath.Join(compiledDir, baseName+".js"))
        }
    }
    
    fmt.Printf("✅ Compiled to: %s\n", jsFile)
    return jsFile, nil
}

func executeWasm(wasmFile, jsFile string, args []string) error {
    fmt.Printf("🚀 Executing WASM: %s with script: %s\n", wasmFile, jsFile)
    
    // WasmEdge 設定
    config := wasmedge.NewConfigure(wasmedge.REFERENCE_TYPES)
    config.AddConfig(wasmedge.BULK_MEMORY_OPERATIONS)
    config.AddConfig(wasmedge.WASI) // WASIを有効化
    defer config.Release()
    
    // VM作成
    vm := wasmedge.NewVMWithConfig(config)
    defer vm.Release()
    
    // WASI設定
    // QuickJSランタイムは argv[0] としてスクリプトファイルを期待
    wasi := vm.GetImportModule(wasmedge.WASI)
    if wasi == nil {
        return fmt.Errorf("failed to get WASI module - make sure WASI is enabled in config")
    }
    
    wasiArgs := []string{"wasmedge_quickjs.wasm", jsFile}
    wasiArgs = append(wasiArgs, args...)
    wasi.InitWasi(
        wasiArgs,        // 引数: [ランタイム名, スクリプトファイル, ...追加引数]
        os.Environ(),    // 環境変数
        []string{"."},   // ディレクトリアクセス許可
    )
    
    // WASM ファイル読み込み・実行
    if err := vm.LoadWasmFile(wasmFile); err != nil {
        return fmt.Errorf("failed to load WASM file: %v", err)
    }
    
    if err := vm.Validate(); err != nil {
        return fmt.Errorf("failed to validate: %v", err)
    }
    
    if err := vm.Instantiate(); err != nil {
        return fmt.Errorf("failed to instantiate: %v", err)
    }
    
    start := time.Now()
    
    // メイン関数実行（_start関数を実行）
    result, err := vm.Execute("_start")
    if err != nil {
        return fmt.Errorf("execution failed: %v", err)
    }
    
    elapsed := time.Since(start)
    fmt.Printf("⚡ Execution completed in: %v\n", elapsed)
    if result != nil && len(result) > 0 {
        fmt.Printf("📊 Result: %v\n", result)
    }
    
    return nil
}

func main() {
    var (
        tsFile   = flag.String("ts", "", "TypeScript file to execute")
        jsFile   = flag.String("js", "", "JavaScript file to execute") 
        wasmFile = flag.String("wasm", "wasmedge_quickjs.wasm", "WasmEdge QuickJS runtime")
        config   = flag.String("config", "", "ETL configuration file")
    )
    flag.Parse()
    
    fmt.Println("🎯 WasmEdge ETL POC")
    fmt.Println("==================")
    
    // 設定ファイル処理
    if *config != "" {
        // TODO: 設定ファイルからパラメータ読み込み
        fmt.Printf("📋 Using config: %s\n", *config)
    }
    
    var targetFile string
    var err error
    
    // TypeScript または JavaScript ファイル決定
    if *tsFile != "" {
        targetFile, err = compileTypeScript(*tsFile)
        if err != nil {
            log.Fatalf("❌ Compilation failed: %v", err)
        }
    } else if *jsFile != "" {
        targetFile = *jsFile
        fmt.Printf("📄 Using JavaScript file: %s\n", targetFile)
    } else {
        log.Fatal("❌ Please specify either --ts or --js file")
    }
    
    // WASM ファイル存在確認
    if _, err := os.Stat(*wasmFile); os.IsNotExist(err) {
        log.Fatalf("❌ WASM file not found: %s\nRun: curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm", *wasmFile)
    }
    
    // WASM 実行
    if err := executeWasm(*wasmFile, targetFile, flag.Args()); err != nil {
        log.Fatalf("❌ WASM execution failed: %v", err)
    }
    
    fmt.Println("\n🎉 POC execution completed successfully!")
}