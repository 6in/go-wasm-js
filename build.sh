#!/bin/bash
# build.sh - WasmEdge-go用のビルドスクリプト（macOSのライブラリパス問題を解決）

WASMEDGE_LIB_PATH="$HOME/.wasmedge/lib"

# CGOフラグでライブラリパスを指定
export CGO_LDFLAGS="-L${WASMEDGE_LIB_PATH} -Wl,-rpath,${WASMEDGE_LIB_PATH}"

echo "🔨 Building with WasmEdge library path: ${WASMEDGE_LIB_PATH}"
go build -o wasmedge-etl main.go

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "To run:"
    echo "  ./wasmedge-etl --ts scripts/etl-sample.ts"
else
    echo "❌ Build failed"
    exit 1
fi

