# WasmEdge + Go + TypeScript/JavaScript

## 概要
このプロジェクトは、GoからTypeScript/JavaScriptを呼び出す仕組みを提供します。WasmEdgeとQuickJSを使用して、TypeScript/JavaScriptコードをWebAssembly環境で安全に実行できます。

## アーキテクチャ
```
Go CLI (main.go) 
    ↓
TypeScript コンパイル
    ↓  
WasmEdge + QuickJS
    ↓
JavaScript/TypeScript 実行
    ↓
実行結果
```

## プロジェクト構造
```
go-wasm-js/
├── main.go                 # Go CLI メイン
├── go.mod                  # Go モジュール設定
├── go.sum                  # Go 依存関係ロック
├── tsconfig.json           # TypeScript 設定
├── setup.sh                # セットアップスクリプト（WasmEdge、QuickJS のインストール）
├── build.sh                # ビルドスクリプト（macOS ライブラリパス対応）
├── scripts/
│   ├── hello.ts            # チュートリアル: HelloWorld
│   ├── calc.ts             # チュートリアル: 変数と関数
│   ├── array-demo.ts       # チュートリアル: 配列とループ
│   ├── json-demo.ts        # チュートリアル: オブジェクトとJSON
│   ├── async-demo.ts       # チュートリアル: 非同期処理
│   ├── use-library.ts      # チュートリアル: 外部ライブラリの利用
│   ├── types.ts            # 型定義（サンプル用）
│   ├── validators.ts       # バリデーター（サンプル用）
│   ├── transformer.ts      # データ変換処理（サンプル用）
│   ├── etl-sample.ts       # サンプルスクリプト1
│   ├── lib-sample.ts       # 外部ライブラリ利用サンプル1（直接配置）
│   ├── yaml-sample.ts      # 外部ライブラリ利用サンプル2（別プロジェクト）
│   ├── host-context.ts     # ホストコンテキスト（型定義）
│   └── libs/               # ビルド済みライブラリ
│       ├── simple-utils.ts # シンプルなユーティリティ（サンプル1）
│       └── yaml-wrapper.js # js-yamlラッパー（ビルド後、サンプル2）
├── wasm-libs/              # 別プロジェクトのライブラリ
│   └── yaml-wrapper/       # js-yamlラッパープロジェクト
│       ├── src/
│       │   └── index.ts    # ライブラリソース
│       ├── package.json    # NPM設定
│       └── build.sh        # ビルドスクリプト
├── compiled/               # TypeScript コンパイル出力（.gitignore）
├── data/
│   ├── sample.json         # テストデータ
│   └── sample-config.yaml  # YAMLサンプルデータ
└── wasmedge_quickjs.wasm   # QuickJS ランタイム（.gitignore）
```

## セットアップ

### 前提条件
- Go 1.21+
- Node.js & npm
- macOS (他のOSでも動作しますが、セットアップスクリプトはmacOS用)

### クイックセットアップ

自動セットアップスクリプトを使用する場合：

```bash
chmod +x setup.sh
./setup.sh
```

このスクリプトは以下を自動実行します：
- WasmEdge のインストール
- QuickJS ランタイム（`wasmedge_quickjs.wasm`）のダウンロード
- Go 依存関係のインストール
- コンパイル用ディレクトリの作成

### 手動セットアップ

#### 1. WasmEdge のインストール

```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
source ~/.wasmedge/env
```

#### 2. QuickJS ランタイムのダウンロード

```bash
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
```

#### 3. Go 依存関係のインストール

```bash
go mod download
```

または、初回の場合：

```bash
go mod init wasmedge-etl-poc
go get github.com/second-state/WasmEdge-go/wasmedge@v0.13.5
```

#### 4. TypeScript コンパイル用ディレクトリの作成

```bash
mkdir -p compiled
```

### ビルド

#### 方法1: ビルドスクリプトを使用（推奨）

```bash
chmod +x build.sh
./build.sh
```

このスクリプトは macOS のライブラリパス問題を解決し、`wasmedge-etl` バイナリを生成します。

#### 方法2: 手動ビルド

```bash
export CGO_LDFLAGS="-L${HOME}/.wasmedge/lib -Wl,-rpath,${HOME}/.wasmedge/lib"
go build -o wasmedge-etl main.go
```

### 実行

#### ビルド済みバイナリを使用

```bash
# TypeScript ファイルを直接実行（自動コンパイル）
./wasmedge-etl --ts scripts/lib-sample.ts

# または、コンパイル済みJavaScriptを実行
./wasmedge-etl --js compiled/lib-sample.js
```

#### go run を使用（開発時）

```bash
# TypeScript ファイルを直接実行（自動コンパイル）
go run main.go --ts scripts/lib-sample.ts

# または、コンパイル済みJavaScriptを実行
go run main.go --js compiled/lib-sample.js
```

#### TypeScript の事前コンパイル

```bash
npx tsc
```

## チュートリアル

段階的に学んでいきましょう。まずは簡単なHelloWorldから始めます。

### ステップ1: HelloWorld

最もシンプルなスクリプトから始めましょう。

1. **スクリプトファイルを作成**

```bash
# scripts/hello.ts を作成
cat > scripts/hello.ts << 'EOF'
// scripts/hello.ts
console.log('Hello, World!');
console.log('TypeScript/JavaScript running in WasmEdge + QuickJS');
EOF
```

2. **実行**

```bash
# ビルド済みバイナリを使用
./wasmedge-etl --ts scripts/hello.ts

# または go run を使用
go run main.go --ts scripts/hello.ts
```

**期待される出力:**
```
🎯 WasmEdge ETL POC
==================
📝 Compiling TypeScript: scripts/hello.ts
✅ Compiled to: compiled/hello.js
🚀 Executing WASM: wasmedge_quickjs.wasm with script: compiled/hello.js
Hello, World!
TypeScript/JavaScript running in WasmEdge + QuickJS
⚡ Execution completed in: 15ms
🎉 POC execution completed successfully!
```

### ステップ2: 変数と関数

次に、変数と関数を使った簡単な計算をしてみましょう。

```typescript
// scripts/calc.ts
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

const num1 = 10;
const num2 = 5;

console.log(`${num1} + ${num2} = ${add(num1, num2)}`);
console.log(`${num1} × ${num2} = ${multiply(num1, num2)}`);
```

**実行:**
```bash
./wasmedge-etl --ts scripts/calc.ts
```

### ステップ3: 配列とループ

配列操作とループを学びましょう。

```typescript
// scripts/array-demo.ts
const fruits = ['apple', 'banana', 'orange'];

console.log('Fruits:');
fruits.forEach((fruit, index) => {
  console.log(`  ${index + 1}. ${fruit}`);
});

// 配列の変換
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log('\nUppercase fruits:', upperFruits);

// フィルタリング
const longFruits = fruits.filter(fruit => fruit.length > 5);
console.log('Long fruits:', longFruits);
```

**実行:**
```bash
./wasmedge-etl --ts scripts/array-demo.ts
```

### ステップ4: オブジェクトとJSON

オブジェクト操作とJSON処理を学びましょう。

```typescript
// scripts/json-demo.ts
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
};

console.log('User object:');
console.log(JSON.stringify(user, null, 2));

// JSON文字列からオブジェクトへ
const jsonString = '{"name":"Jane","age":25,"email":"jane@example.com"}';
const parsedUser = JSON.parse(jsonString) as User;
console.log('\nParsed user:');
console.log(`Name: ${parsedUser.name}, Age: ${parsedUser.age}`);
```

**実行:**
```bash
./wasmedge-etl --ts scripts/json-demo.ts
```

### ステップ5: 非同期処理

`async/await`を使った非同期処理を学びましょう。

```typescript
// scripts/async-demo.ts
function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    // QuickJSではsetTimeoutが使えないため、即座に解決
    // 実際の環境では、Go側でタイマー機能を提供する必要があります
    resolve();
  });
}

async function processData() {
  console.log('Processing started...');
  
  // データ処理のシミュレーション
  const data = [1, 2, 3, 4, 5];
  const doubled = data.map(n => n * 2);
  
  console.log('Original:', data);
  console.log('Doubled:', doubled);
  console.log('Processing completed!');
}

processData()
  .then(() => {
    console.log('All done!');
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

**実行:**
```bash
./wasmedge-etl --ts scripts/async-demo.ts
```

### ステップ6: 外部ライブラリの利用

プロジェクトに含まれているライブラリを使ってみましょう。

```typescript
// scripts/use-library.ts
import { formatCurrency, slugify, truncate } from './libs/simple-utils.js';

console.log('=== Library Usage Demo ===\n');

// 通貨フォーマット
console.log('Currency formatting:');
console.log(formatCurrency(1000));
console.log(formatCurrency(5000, 'JPY'));

// スラッグ化
console.log('\nSlugify:');
console.log(slugify('Hello World!'));
console.log(slugify('TypeScript & JavaScript'));

// テキスト切り詰め
console.log('\nTruncate:');
const longText = 'This is a very long text that needs truncation';
console.log(truncate(longText, 20));
```

**実行:**
```bash
./wasmedge-etl --ts scripts/use-library.ts
```

### 次のステップ

基本的な使い方を理解したら、以下を試してみましょう：

- **サンプルコードの確認**: `scripts/lib-sample.ts` - ライブラリの詳細な使用例
- **YAML処理**: `scripts/yaml-sample.ts` - 外部ライブラリ（js-yaml）の利用例
- **データ処理**: `scripts/etl-sample.ts` - より複雑なデータ処理の例

## 使用方法

### 基本的な実行

#### ビルド済みバイナリを使用（推奨）
```bash
# ビルド（初回のみ）
./build.sh

# TypeScript スクリプト実行
./wasmedge-etl --ts scripts/lib-sample.ts

# JavaScript ファイル実行
./wasmedge-etl --js compiled/lib-sample.js

# カスタムWASMランタイム指定
./wasmedge-etl --ts scripts/lib-sample.ts --wasm custom_quickjs.wasm
```

#### go run を使用（開発時）
```bash
# TypeScript スクリプト実行
go run main.go --ts scripts/lib-sample.ts

# JavaScript ファイル実行
go run main.go --js compiled/lib-sample.js

# カスタムWASMランタイム指定
go run main.go --ts scripts/lib-sample.ts --wasm custom_quickjs.wasm
```

### 出力例
```
🎯 WasmEdge TypeScript/JavaScript Runner
========================================
📝 Compiling TypeScript: scripts/lib-sample.ts
✅ Compiled to: compiled/lib-sample.js
🚀 Executing WASM: wasmedge_quickjs.wasm with script: compiled/lib-sample.js
📚 Library Usage Sample
======================

1. Currency Formatting:
   $1000 → $1,000
   ¥5000 → ¥5,000
   €2500 → €2,500

2. Slugify:
   "Hello World!" → "hello-world"
   "TypeScript & JavaScript" → "typescript-javascript"

3. Truncate:
   "This is a very long text..." → "This is a very lo..."

4. Simple Cache:
   Cache size: 3
   user:1 = 100
   user:2 = 200

✅ Library usage demonstration completed!
⚡ Execution completed in: 23ms
🎉 POC execution completed successfully!
```

## カスタマイズ

### 新しいスクリプトの追加
1. `scripts/` ディレクトリに新しい `.ts` ファイルを作成
2. TypeScriptコードを記述
3. Go CLIで実行: `./wasmedge-etl --ts scripts/your-script.ts`

### サンプルコードの参考
- `scripts/etl-sample.ts` - データ処理のサンプル
- `scripts/lib-sample.ts` - ライブラリ利用のサンプル
- `scripts/yaml-sample.ts` - 外部ライブラリ（js-yaml）利用のサンプル

### 外部ライブラリの利用

QuickJS環境では、Node.jsの`require()`は使えませんが、ES Modules形式のライブラリを利用できます。以下の方法があります：

#### 方法1: ES Modules形式のライブラリを直接使用

ES Modules形式（`import`/`export`）で提供されているライブラリの場合：

```typescript
// scripts/my-script.ts
import { someFunction } from './libs/some-library.js';

// 使用
const result = someFunction();
```

**手順:**
1. ライブラリのES Modules版をダウンロード
2. `scripts/libs/` ディレクトリに配置
3. TypeScriptからインポート

#### 方法2: バンドラーを使用して単一ファイルに統合

`esbuild`や`rollup`などのバンドラーを使用して、ライブラリを単一ファイルにバンドル：

```bash
# esbuildを使用した例
npx esbuild scripts/my-script.ts --bundle --format=esm --outfile=compiled/my-script.js
```

**メリット:**
- 依存関係を自動解決
- 単一ファイルで配布可能
- ツリーシェイキングでサイズ最適化

**注意点:**
- Node.js APIに依存するライブラリは動作しない
- ブラウザ/Node.js専用のライブラリは使用不可

#### 方法2b: 別プロジェクトでNPMパッケージとして作成・ビルド

より大規模なライブラリや再利用可能なモジュールの場合、別プロジェクトとして作成し、ビルド・バンドルした成果物を配置：

**手順:**

1. **別プロジェクトでライブラリを作成**
   ```bash
   # 新しいプロジェクトディレクトリ
   mkdir my-wasm-lib
   cd my-wasm-lib
   npm init -y
   
   # TypeScriptとビルドツールをインストール
   npm install -D typescript esbuild
   ```

2. **ライブラリのソースコードを作成**
   ```typescript
   // src/index.ts
   export function myLibraryFunction() {
     // 実装
   }
   ```

3. **ビルド設定（package.json）**
   ```json
   {
     "scripts": {
       "build": "esbuild src/index.ts --bundle --format=esm --outfile=dist/index.js --external:none"
     }
   }
   ```

4. **ビルド実行**
   ```bash
   npm run build
   ```

5. **ビルド成果物をメインプロジェクトに配置**
   ```bash
   # メインプロジェクトの scripts/libs/ にコピー
   cp dist/index.js /path/to/go-wasm-js/scripts/libs/my-library.js
   ```

6. **TypeScriptから使用**
   ```typescript
   // scripts/my-script.ts
   import { myLibraryFunction } from './libs/my-library.js';
   
   const result = myLibraryFunction();
   ```

**メリット:**
- ライブラリを独立したプロジェクトとして管理
- バージョン管理が容易
- 複数のプロジェクトで再利用可能
- ビルド設定を分離できる
- CI/CDで自動ビルド・デプロイ可能

**推奨ディレクトリ構造:**
```
go-wasm-js/
├── scripts/
│   ├── libs/              # ビルド済みライブラリ
│   │   ├── my-library.js
│   │   └── another-lib.js
│   └── my-script.ts
└── ...
```

#### 方法3: ライブラリのソースコードを直接含める

小さなライブラリやユーティリティの場合、ソースコードを直接プロジェクトに含める：

```typescript
// scripts/libs/my-utils.ts
export function myUtility() {
  // 実装
}

// scripts/my-script.ts
import { myUtility } from './libs/my-utils.js';
```

#### 方法4: UMD形式をグローバルスコープに展開

UMD形式のライブラリをグローバル変数として使用：

```typescript
// ライブラリをグローバルスコープに展開（手動で調整が必要）
declare const MyLibrary: any;

// 使用
const result = MyLibrary.someFunction();
```

#### 推奨アプローチ

1. **軽量なユーティリティ**: 方法3（ソースコードを直接含める）
2. **中規模ライブラリ**: 方法1（ES Modules形式を直接使用）
3. **複雑な依存関係**: 方法2（バンドラーを使用）
4. **再利用可能なライブラリ・大規模モジュール**: 方法2b（別プロジェクトでNPMパッケージとして作成・ビルド）

**方法2bの使用例:**
- 複数のプロジェクトで共有するライブラリ
- ビルド設定が複雑なライブラリ
- バージョン管理が必要なライブラリ
- CI/CDで自動ビルドしたいライブラリ

#### 利用可能なライブラリの例

- **日付処理**: カスタム実装または軽量なライブラリ
- **データ処理**: LodashのES Modules版（`lodash-es`）
- **バリデーション**: カスタム実装
- **ユーティリティ**: 軽量なES Modulesライブラリ
- **YAML処理**: js-yaml（別プロジェクトでビルド）

#### 実装サンプル

このプロジェクトには、外部ライブラリの利用方法を示す2つのサンプルが含まれています：

**サンプル1: 直接配置したライブラリの利用**
- ライブラリ: `scripts/libs/simple-utils.ts` - シンプルなユーティリティ関数
- 使用例: `scripts/lib-sample.ts`
- 実行方法:
  ```bash
  ./wasmedge-etl --ts scripts/lib-sample.ts
  ```

**サンプル2: 別プロジェクトでビルドしたライブラリの利用**
- ライブラリプロジェクト: `wasm-libs/yaml-wrapper/` - js-yamlのラッパー
- 使用例: `scripts/yaml-sample.ts`
- セットアップ手順:
  ```bash
  # 1. ライブラリプロジェクトに移動
  cd wasm-libs/yaml-wrapper
  
  # 2. 依存関係をインストール
  npm install
  
  # 3. ビルド（自動的にscripts/libs/にコピー）
  ./build.sh
  
  # または手動で
  npm run build
  cp dist/index.js ../../scripts/libs/yaml-wrapper.js
  ```
- 実行方法:
  ```bash
  ./wasmedge-etl --ts scripts/yaml-sample.ts
  ```

これらのサンプルは、外部ライブラリを利用する際の実装パターンを示しています。

#### 注意事項

- ❌ Node.js専用API（`fs`, `http`, `process`など）に依存するライブラリは使用不可
- ❌ ブラウザ専用API（`window`, `document`など）に依存するライブラリは使用不可
- ✅ 純粋なJavaScript/TypeScriptライブラリ（計算、データ変換など）は利用可能
- ✅ ES Modules形式で提供されているライブラリは利用可能

## 技術スタック
- **Go**: CLI制御、WasmEdge統合
- **TypeScript**: 型安全なJavaScriptコード
- **WasmEdge**: WebAssemblyランタイム
- **QuickJS**: JavaScript実行エンジン

## 実行環境の制約

この環境は**計算エンジン・データ処理エンジン**として最適化されています。

### ✅ 利用可能な機能

- **基本的なJavaScript機能**: 変数、関数、クラス、配列・オブジェクト操作、ループ、条件分岐
- **標準ライブラリ**: `console.log()`, `JSON.stringify()`, `Date`, `Math`, 配列メソッド
- **ES2020機能**: `async/await`, `Promise`, アロー関数, 分割代入, テンプレートリテラル
- **TypeScript**: 型チェック、型定義

### ❌ 利用不可能な機能

- **ファイルアクセス**: Node.js `fs` モジュール、標準JS API経由のファイル読み書き
- **ネットワークアクセス**: `fetch()`, `XMLHttpRequest`, Node.js `http`/`https` モジュール
- **データベースアクセス**: SQLite、MySQL/PostgreSQL、MongoDB などのドライバ
- **Node.js API**: `process.env`, `require()`/`module.exports`, `path`, `os`, `crypto` など
- **ブラウザAPI**: `window`, `document`, DOM操作, `localStorage`

### 推奨アーキテクチャ

```
┌─────────────────┐
│   TypeScript    │  ← ビジネスロジック・データ変換
│   (QuickJS)     │     計算・バリデーション
└────────┬────────┘
         │ データの受け渡し
┌────────▼────────┐
│   Go (Host)     │  ← システムリソースアクセス
│                 │     ファイル・ネットワーク・DB
└─────────────────┘
```

**原則**: 
- **TypeScript**: データ処理・ロジック・計算
- **Go**: システムリソースアクセス・I/O

ファイルアクセスやネットワークアクセスが必要な場合は、Go側で実装し、データをTypeScriptに渡すアーキテクチャを推奨します。

## パフォーマンス
- TypeScript コンパイル: ~1-2秒
- WASM 初期化: ~50-100ms
- スクリプト実行: ~10-50ms (処理内容依存)
- 総実行時間: ~1-3秒 (初回コンパイル含む)

## セキュリティ
- WasmEdgeサンドボックス内で実行
- ファイルシステムアクセス制限
- ネットワークアクセス制御可能
- メモリ使用量制限可能

## トラブルシューティング

### WasmEdge が見つからない

**解決方法1: セットアップスクリプトを使用**
```bash
./setup.sh
```

**解決方法2: 手動インストール**
```bash
curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash
source ~/.wasmedge/env
```

### QuickJS runtime が見つからない

**解決方法1: セットアップスクリプトを使用**
```bash
./setup.sh
```

**解決方法2: 手動ダウンロード**
```bash
curl -OL https://github.com/second-state/wasmedge-quickjs/releases/download/v0.5.0-alpha/wasmedge_quickjs.wasm
```

### ビルドエラー（ライブラリが見つからない）

macOS で `wasmedge` ライブラリが見つからない場合：

**解決方法1: ビルドスクリプトを使用**
```bash
./build.sh
```

**解決方法2: 環境変数を手動設定**
```bash
export CGO_LDFLAGS="-L${HOME}/.wasmedge/lib -Wl,-rpath,${HOME}/.wasmedge/lib"
go build -o wasmedge-etl main.go
```

### TypeScript コンパイルエラー

```bash
# TypeScript をグローバルインストール
npm install -g typescript

# または、npx を使用
npx tsc

# tsconfig.json を使用する場合
npx tsc --project tsconfig.json
```

### 実行時エラー

- `wasmedge_quickjs.wasm` が存在するか確認: `ls -la wasmedge_quickjs.wasm`
- WasmEdge のパスが通っているか確認: `which wasmedge`
- 環境変数を再読み込み: `source ~/.wasmedge/env`

## 拡張可能性
- HTTP API エンドポイントの追加
- データベース連携
- ストリーミング処理
- Kubernetes デプロイメント
- CI/CD パイプライン統合
- プラグインシステムの構築

## ライセンス
MIT License

## 参考資料
- [WasmEdge Documentation](https://wasmedge.org/docs/)
- [WasmEdge-Go SDK](https://github.com/second-state/WasmEdge-go)
- [QuickJS WebAssembly](https://github.com/second-state/wasmedge-quickjs)