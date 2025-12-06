// scripts/lib-sample.ts
// 別ファイルのライブラリを直接利用するサンプル

import { formatCurrency, slugify, truncate, SimpleCache } from './libs/simple-utils.js';

async function demonstrateLibraryUsage() {
  console.log('📚 Library Usage Sample');
  console.log('======================\n');

  // 1. 通貨フォーマット
  console.log('1. Currency Formatting:');
  console.log(`   $1000 → ${formatCurrency(1000)}`);
  console.log(`   ¥5000 → ${formatCurrency(5000, 'JPY')}`);
  console.log(`   €2500 → ${formatCurrency(2500, 'EUR')}`);
  console.log('');

  // 2. スラッグ化
  console.log('2. Slugify:');
  const titles = [
    'Hello World!',
    'TypeScript & JavaScript',
    'WasmEdge + QuickJS = Awesome'
  ];
  titles.forEach(title => {
    console.log(`   "${title}" → "${slugify(title)}"`);
  });
  console.log('');

  // 3. テキスト切り詰め
  console.log('3. Truncate:');
  const longText = 'This is a very long text that needs to be truncated';
  console.log(`   "${longText}"`);
  console.log(`   → "${truncate(longText, 20)}"`);
  console.log('');

  // 4. キャッシュ
  console.log('4. Simple Cache:');
  const cache = new SimpleCache<string, number>(5);
  
  // データをキャッシュに追加
  cache.set('user:1', 100);
  cache.set('user:2', 200);
  cache.set('user:3', 300);
  
  console.log(`   Cache size: ${cache.size()}`);
  console.log(`   user:1 = ${cache.get('user:1')}`);
  console.log(`   user:2 = ${cache.get('user:2')}`);
  console.log(`   user:999 = ${cache.get('user:999') || 'not found'}`);
  
  // 最大サイズを超えると古いエントリが削除される
  cache.set('user:4', 400);
  cache.set('user:5', 500);
  cache.set('user:6', 600); // user:1が削除される
  
  console.log(`   After adding more entries, cache size: ${cache.size()}`);
  console.log(`   user:1 = ${cache.get('user:1') || 'removed (cache full)'}`);
  console.log(`   user:6 = ${cache.get('user:6')}`);
  console.log('');

  console.log('✅ Library usage demonstration completed!');
}

// 実行
demonstrateLibraryUsage()
  .then(() => {
    console.log('\n🎉 Sample execution completed successfully!');
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });

