// scripts/etl-sample.ts
import { RawRecord, ProcessedRecord, ETLResult, ETLStats } from './types.js';
import { DataTransformer } from './transformer.js';

async function runETLPipeline(rawData: RawRecord[]): Promise<ETLResult> {
  const startTime = Date.now();
  
  console.log(`🚀 Starting ETL Pipeline - Processing ${rawData.length} records`);
  
  try {
    // バッチ処理（実際のシステムではストリーム処理も可能）
    const processedRecords: ProcessedRecord[] = [];
    const errors: string[] = [];

    for (let i = 0; i < rawData.length; i++) {
      try {
        const record = rawData[i];
        console.log(`Processing record ${i + 1}: ${record.name}`);
        
        const processed = DataTransformer.transformRecord(record);
        processedRecords.push(processed);
        
        if (!processed.isValid) {
          console.log(`⚠️  Record ${record.id} has validation errors:`, processed.validationErrors);
        } else {
          console.log(`✅ Record ${record.id} processed successfully`);
        }
        
      } catch (error) {
        const errorMsg = `Failed to process record ${i}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    const endTime = Date.now();
    const validRecords = processedRecords.filter(r => r.isValid);
    
    const stats: ETLStats = {
      totalRecords: rawData.length,
      processedRecords: processedRecords.length,
      validRecords: validRecords.length,
      errorRecords: processedRecords.length - validRecords.length,
      processingTimeMs: endTime - startTime
    };

    console.log('\n📊 ETL Pipeline Statistics:');
    console.log(`   Total Records: ${stats.totalRecords}`);
    console.log(`   Processed: ${stats.processedRecords}`);
    console.log(`   Valid: ${stats.validRecords}`);
    console.log(`   Errors: ${stats.errorRecords}`);
    console.log(`   Processing Time: ${stats.processingTimeMs}ms`);

    return {
      success: true,
      data: processedRecords,
      stats,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    return {
      success: false,
      data: [],
      stats: {
        totalRecords: rawData.length,
        processedRecords: 0,
        validRecords: 0,
        errorRecords: 0,
        processingTimeMs: Date.now() - startTime
      },
      errors: [String(error)]
    };
  }
}

// サンプルデータ
const sampleData: RawRecord[] = [
  {
    id: 1,
    name: "john doe",
    email: "JOHN.DOE@COMPANY.COM",
    age: "28",
    department: "eng",
    salary: 75000
  },
  {
    id: 2,
    name: "jane smith",
    email: "jane.smith@company.com",
    age: 32,
    department: "marketing",
    salary: 65000
  },
  {
    id: 3,
    name: "",
    email: "invalid-email",
    age: "abc",
    department: "unknown"
  },
  {
    id: 4,
    name: "bob wilson",
    email: "bob@company.com",
    age: 45,
    department: "sales",
    salary: 80000
  }
];

// メイン実行
runETLPipeline(sampleData)
  .then(result => {
    console.log('\n🎯 Final Result:');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(error => {
    console.error('💥 Pipeline failed:', error);
  });