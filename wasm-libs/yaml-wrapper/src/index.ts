// wasm-libs/yaml-wrapper/src/index.ts
// js-yamlをラップしてQuickJS環境で使用可能にする

// js-yamlをインポート（esbuildがバンドル時に解決）
import * as yaml from 'js-yaml';

// YAML文字列をパースしてオブジェクトに変換
export function parseYAML(yamlString: string): any {
  try {
    return yaml.load(yamlString);
  } catch (error) {
    throw new Error(`YAML parse error: ${error}`);
  }
}

// オブジェクトをYAML文字列に変換
export function stringifyYAML(obj: any, options?: { indent?: number }): string {
  try {
    return yaml.dump(obj, {
      indent: options?.indent || 2,
      lineWidth: -1, // 折り返しなし
    });
  } catch (error) {
    throw new Error(`YAML stringify error: ${error}`);
  }
}

// YAMLファイルのバリデーション
export function validateYAML(yamlString: string): { valid: boolean; error?: string } {
  try {
    yaml.load(yamlString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// 型安全なYAMLパース（型を指定）
export function parseYAMLAs<T>(yamlString: string): T {
  const result = parseYAML(yamlString);
  return result as T;
}

// エクスポート（js-yamlの主要機能も再エクスポート）
export { yaml };
export default {
  parse: parseYAML,
  stringify: stringifyYAML,
  validate: validateYAML,
  parseAs: parseYAMLAs,
};

