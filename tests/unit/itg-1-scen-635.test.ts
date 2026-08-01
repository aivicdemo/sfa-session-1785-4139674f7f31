import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { generateActionPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-635
  test('対象期間が正確に過去3ヶ月（直近90日）に設定される', () => {
    const fixed_test_date = new Date('2024-01-15T00:00:00Z');
    const sales_rep_id = 'SR001';

    const result = generateActionPatternAnalysisReport({
      sales_rep_id,
      current_date: fixed_test_date,
    });

    const expected_start_date = new Date('2023-10-17T00:00:00Z');
    const expected_end_date = new Date('2024-01-15T23:59:59Z');

    expect(result.period_start).toEqual(expected_start_date);
    expect(result.period_end).toEqual(expected_end_date);
    expect(result.sales_rep_id).toBe('SR001');
    expect(result.report_generated).toBe(true);
  });
});