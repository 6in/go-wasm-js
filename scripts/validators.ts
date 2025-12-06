// scripts/validators.ts
import { RawRecord } from './types.js';

export class RecordValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateAge(age: string | number): { isValid: boolean; age: number } {
    const numAge = typeof age === 'string' ? parseInt(age) : age;
    const isValid = !isNaN(numAge) && numAge >= 0 && numAge <= 120;
    return { isValid, age: isValid ? numAge : 0 };
  }

  static validateName(name: string): boolean {
    return !!(name && name.trim().length >= 2);
  }

  static validateSalary(salary?: number): number {
    return salary && salary > 0 ? salary : 0;
  }

  static validateRecord(record: RawRecord): string[] {
    const errors: string[] = [];

    if (!this.validateName(record.name)) {
      errors.push(`Invalid name: ${record.name}`);
    }

    if (!this.validateEmail(record.email)) {
      errors.push(`Invalid email: ${record.email}`);
    }

    const ageValidation = this.validateAge(record.age);
    if (!ageValidation.isValid) {
      errors.push(`Invalid age: ${record.age}`);
    }

    return errors;
  }
}