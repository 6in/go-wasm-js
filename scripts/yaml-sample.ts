// scripts/yaml-sample.ts
// 別プロジェクトでビルドしたjs-yamlラッパーを利用するサンプル

// ビルド済みライブラリをインポート
// 注意: 実際に使用するには、wasm-libs/yaml-wrapper をビルドして
// scripts/libs/yaml-wrapper.js に配置する必要があります
import { parseYAML, stringifyYAML, validateYAML, parseYAMLAs } from './libs/yaml-wrapper.js';

interface UserConfig {
  name: string;
  age: number;
  email: string;
  preferences: {
    theme: string;
    language: string;
  };
}

async function demonstrateYAMLLibrary() {
  console.log('📄 YAML Library Usage Sample');
  console.log('============================\n');

  // サンプルYAMLデータ
  const yamlString = `
name: John Doe
age: 30
email: john.doe@example.com
preferences:
  theme: dark
  language: en
`;

  // 1. YAML文字列をパース
  console.log('1. Parsing YAML:');
  console.log('   Input YAML:');
  console.log(yamlString);
  
  const parsed = parseYAML(yamlString);
  console.log('   Parsed object:');
  console.log(JSON.stringify(parsed, null, 2));
  console.log('');

  // 2. 型安全なパース
  console.log('2. Type-safe parsing:');
  const userConfig = parseYAMLAs<UserConfig>(yamlString);
  console.log(`   Name: ${userConfig.name}`);
  console.log(`   Age: ${userConfig.age}`);
  console.log(`   Email: ${userConfig.email}`);
  console.log(`   Theme: ${userConfig.preferences.theme}`);
  console.log('');

  // 3. オブジェクトをYAMLに変換
  console.log('3. Converting object to YAML:');
  const obj = {
    users: [
      { name: 'Alice', role: 'admin' },
      { name: 'Bob', role: 'user' }
    ],
    settings: {
      debug: true,
      timeout: 5000
    }
  };
  
  const yamlOutput = stringifyYAML(obj, { indent: 2 });
  console.log('   Object:');
  console.log(JSON.stringify(obj, null, 2));
  console.log('   YAML output:');
  console.log(yamlOutput);
  console.log('');

  // 4. YAMLのバリデーション
  console.log('4. YAML validation:');
  const validYAML = `
key1: value1
key2: value2
`;
  const invalidYAML = `
key1: value1
  invalid: indentation
key2: value2
`;

  const validResult = validateYAML(validYAML);
  console.log(`   Valid YAML: ${validResult.valid}`);
  
  const invalidResult = validateYAML(invalidYAML);
  console.log(`   Invalid YAML: ${invalidResult.valid}`);
  if (!invalidResult.valid) {
    console.log(`   Error: ${invalidResult.error}`);
  }
  console.log('');

  // 5. 実際の使用例: 設定ファイルのパース
  console.log('5. Real-world example: Config file parsing');
  const configYAML = `
database:
  host: localhost
  port: 5432
  name: myapp
api:
  timeout: 30000
  retries: 3
features:
  - feature1
  - feature2
`;

  const config = parseYAML(configYAML);
  console.log('   Config parsed:');
  console.log(`   Database: ${config.database.host}:${config.database.port}/${config.database.name}`);
  console.log(`   API timeout: ${config.api.timeout}ms`);
  console.log(`   Features: ${config.features.join(', ')}`);
  console.log('');

  console.log('✅ YAML library usage demonstration completed!');
}

// 実行
demonstrateYAMLLibrary()
  .then(() => {
    console.log('\n🎉 Sample execution completed successfully!');
  })
  .catch(error => {
    console.error('❌ Error:', error);
    console.error('\n💡 Note: Make sure to build the yaml-wrapper library first:');
    console.error('   cd wasm-libs/yaml-wrapper');
    console.error('   npm install');
    console.error('   npm run build');
    console.error('   cp dist/index.js ../scripts/libs/yaml-wrapper.js');
  });

