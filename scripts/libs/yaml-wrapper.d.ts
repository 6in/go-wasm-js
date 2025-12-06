// scripts/libs/yaml-wrapper.d.ts
// js-yamlラッパーの型定義

export function parseYAML(yamlString: string): any;
export function stringifyYAML(obj: any, options?: { indent?: number }): string;
export function validateYAML(yamlString: string): { valid: boolean; error?: string };
export function parseYAMLAs<T>(yamlString: string): T;

export const yaml: any;

declare const yamlWrapper: {
  parse: typeof parseYAML;
  stringify: typeof stringifyYAML;
  validate: typeof validateYAML;
  parseAs: typeof parseYAMLAs;
};

export default yamlWrapper;

