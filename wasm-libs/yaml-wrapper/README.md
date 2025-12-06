# YAML Wrapper for WasmEdge QuickJS

js-yamlをラップして、WasmEdge QuickJS環境で使用可能にするライブラリです。

## セットアップ

```bash
# 依存関係のインストール
npm install

# ビルド
npm run build
```

## ビルド成果物の配置

ビルド後、`dist/index.js` をメインプロジェクトの `scripts/libs/` にコピー：

```bash
cp dist/index.js /path/to/go-wasm-js/scripts/libs/yaml-wrapper.js
```

## 使用方法

メインプロジェクトのTypeScriptから：

```typescript
import { parseYAML, stringifyYAML } from './libs/yaml-wrapper.js';

const yamlStr = `
name: John Doe
age: 30
`;

const obj = parseYAML(yamlStr);
console.log(obj);
```

