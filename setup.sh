#!/bin/bash
# setup.sh
echo "🚀 Setting up WasmEdge ETL POC..."

# WasmEdge インストール (Mac)
if ! command -v wasmedge &> /dev/null; then
    echo "Installing WasmEdge..."
    curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
    source ~/.wasmedge/env
fi

# QuickJS ランタイム ダウンロード
if [ ! -f "wasmedge_quickjs.wasm" ]; then
    echo "Downloading QuickJS runtime..."
    curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
fi

# Go 依存関係
echo "Installing Go dependencies..."
go mod init wasmedge-etl-poc
go get github.com/second-state/WasmEdge-go/wasmedge@v0.13.5

# TypeScript コンパイル用ディレクトリ作成
mkdir -p compiled

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Compile TypeScript: npx tsc scripts/*.ts --target ES2020 --module ES2020 --outDir compiled/"
echo "2. Run: go run main.go --ts scripts/etl-sample.ts"
echo ""
echo "Or use JavaScript directly:"
echo "go run main.go --js compiled/etl-sample.js"