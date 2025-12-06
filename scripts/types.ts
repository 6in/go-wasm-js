// scripts/types.ts
export interface RawRecord {
  id: number;
  name: string;
  email: string;
  age: string | number;
  department?: string;
  salary?: number;
}

export interface ProcessedRecord {
  id: number;
  fullName: string;
  emailAddress: string;
  ageInYears: number;
  department: string;
  salaryUSD: number;
  isValid: boolean;
  processedAt: string;
  validationErrors: string[];
}

export interface ETLStats {
  totalRecords: number;
  processedRecords: number;
  validRecords: number;
  errorRecords: number;
  processingTimeMs: number;
}

export interface ETLResult {
  success: boolean;
  data: ProcessedRecord[];
  stats: ETLStats;
  errors?: string[];
}