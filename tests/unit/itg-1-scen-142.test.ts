import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-142
  test('分析期間の開始日が null のときレポート生成が失敗し INVALID_START_DATE エラーが返される', () => {
    const input = {
      sales_person_id: 'SP-001',
      department_id: 'DEPT-001',
      analysis_start_date: null,
      analysis_end_date: new Date('2024-12-31'),
    };

    expect(() => generateSalesPersonAnalysisReport(input)).toThrow(/INVALID_START_DATE/);
  });
});