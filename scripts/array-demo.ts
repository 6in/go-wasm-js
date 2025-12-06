// scripts/array-demo.ts
const fruits = ['apple', 'banana', 'orange'];

console.log('Fruits:');
fruits.forEach((fruit, index) => {
  console.log(`  ${index + 1}. ${fruit}`);
});

// 配列の変換
const upperFruits = fruits.map(fruit => fruit.toUpperCase());
console.log('\nUppercase fruits:', upperFruits);

// フィルタリング
const longFruits = fruits.filter(fruit => fruit.length > 5);
console.log('Long fruits:', longFruits);

