// scripts/calc.ts
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

const num1 = 10;
const num2 = 5;

console.log(`${num1} + ${num2} = ${add(num1, num2)}`);
console.log(`${num1} × ${num2} = ${multiply(num1, num2)}`);

