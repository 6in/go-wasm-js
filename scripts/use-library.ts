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

