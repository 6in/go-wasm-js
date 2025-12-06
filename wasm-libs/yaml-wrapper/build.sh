#!/bin/bash
# yaml-wrapper ビルドスクリプト

set -e

echo "🔨 Building yaml-wrapper library..."

# 依存関係のインストール
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# ビルド
echo "🔨 Building..."
npm run build

# メインプロジェクトのlibsディレクトリにコピー
LIB_DIR="../../scripts/libs"
COMPILED_LIB_DIR="../../compiled/libs"
mkdir -p "$LIB_DIR"
mkdir -p "$COMPILED_LIB_DIR"

echo "📋 Copying to $LIB_DIR..."
cp dist/index.js "$LIB_DIR/yaml-wrapper.js"

echo "📋 Copying to $COMPILED_LIB_DIR (for compiled scripts)..."
cp dist/index.js "$COMPILED_LIB_DIR/yaml-wrapper.js"

echo "✅ Build completed!"
echo "   Output: $LIB_DIR/yaml-wrapper.js"
echo "   Output: $COMPILED_LIB_DIR/yaml-wrapper.js"

