// scripts/transformer.ts
import { RawRecord, ProcessedRecord } from './types.js';
import { RecordValidator } from './validators.js';

export class DataTransformer {
  static formatName(name: string): string {
    return name.trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static normalizeDepartment(dept?: string): string {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const normalized = dept?.toLowerCase().trim();
    
    const found = departments.find(d => 
      d.toLowerCase().includes(normalized || '') || 
      (normalized || '').includes(d.toLowerCase())
    );
    
    return found || 'Other';
  }

  static transformRecord(record: RawRecord): ProcessedRecord {
    const validationErrors = RecordValidator.validateRecord(record);
    const ageValidation = RecordValidator.validateAge(record.age);
    
    const processed: ProcessedRecord = {
      id: record.id,
      fullName: this.formatName(record.name || ''),
      emailAddress: this.normalizeEmail(record.email || ''),
      ageInYears: ageValidation.age,
      department: this.normalizeDepartment(record.department),
      salaryUSD: RecordValidator.validateSalary(record.salary),
      isValid: validationErrors.length === 0,
      processedAt: new Date().toISOString(),
      validationErrors
    };

    return processed;
  }
}