// Host Context - Goから提供されるコンテキストへのアクセス

export interface HostContext {
  baseDir: string;
  env: Record<string, string>;
}

let hostContext: HostContext | null = null;

// コンテキストを初期化（環境変数から読み込み）
export function initHostContext(): HostContext {
  if (hostContext) {
    return hostContext;
  }

  // 環境変数からコンテキストを取得
  // 注意: QuickJSでは process.env が使えないため、
  // WASI経由で環境変数にアクセスする必要がある
  // ここでは、Go側で環境変数として渡されたコンテキストを想定
  
  // 実際の実装では、WASIの環境変数APIを使用
  // または、Go側でファイルとして書き出して読み込む
  
  try {
    // 簡易実装: 環境変数から取得（実際にはWASI APIが必要）
    const contextStr = getEnvVar('HOST_CONTEXT');
    if (contextStr) {
      hostContext = JSON.parse(contextStr) as HostContext;
      return hostContext;
    }
  } catch (e) {
    console.error('Failed to parse host context:', e);
  }

  // フォールバック: デフォルト値
  hostContext = {
    baseDir: '.',
    env: {},
  };
  
  return hostContext;
}

// 環境変数取得（WASI経由 - 実装が必要）
function getEnvVar(key: string): string {
  // 実際の実装では、WASIの環境変数APIを使用
  // ここではプレースホルダー
  return '';
}

// ファイル読み込み（Go側の関数を呼び出す想定）
export async function readFile(path: string): Promise<string> {
  const ctx = initHostContext();
  const fullPath = `${ctx.baseDir}/${path}`;
  
  // 実際の実装では、Go側のホスト関数を呼び出す
  // または、WASI経由でファイルアクセス
  // ここではプレースホルダー
  throw new Error('File access not yet implemented - requires Go host function');
}

// ファイル書き込み
export async function writeFile(path: string, content: string): Promise<void> {
  const ctx = initHostContext();
  const fullPath = `${ctx.baseDir}/${path}`;
  
  // 実際の実装では、Go側のホスト関数を呼び出す
  throw new Error('File write not yet implemented - requires Go host function');
}

// HTTPリクエスト
export async function httpRequest(
  method: string,
  url: string,
  body?: string
): Promise<{ status: number; body: string; headers: Record<string, string[]> }> {
  // 実際の実装では、Go側のホスト関数を呼び出す
  throw new Error('HTTP request not yet implemented - requires Go host function');
}

// 環境変数取得
export function getEnv(key: string): string {
  const ctx = initHostContext();
  return ctx.env[key] || '';
}

// ベースディレクトリ取得
export function getBaseDir(): string {
  const ctx = initHostContext();
  return ctx.baseDir;
}

