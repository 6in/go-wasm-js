// scripts/json-demo.ts
interface User {
  name: string;
  age: number;
  email: string;
}

const user: User = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
};

console.log('User object:');
console.log(JSON.stringify(user, null, 2));

// JSON文字列からオブジェクトへ
const jsonString = '{"name":"Jane","age":25,"email":"jane@example.com"}';
const parsedUser = JSON.parse(jsonString) as User;
console.log('\nParsed user:');
console.log(`Name: ${parsedUser.name}, Age: ${parsedUser.age}`);

