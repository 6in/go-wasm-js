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

