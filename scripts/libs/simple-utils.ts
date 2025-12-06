// scripts/libs/simple-utils.ts
// シンプルなユーティリティライブラリの例（直接配置）

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // QuickJS環境ではIntl.NumberFormatが利用できない可能性があるため、
  // シンプルな実装に変更
  const symbols: Record<string, string> = {
    'USD': '$',
    'JPY': '¥',
    'EUR': '€',
    'GBP': '£'
  };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
}

export class SimpleCache<K, V> {
  private cache: Map<K, V> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

