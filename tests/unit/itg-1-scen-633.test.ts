import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-633
  test('分析対象期間の開始日付が終了日付より後のときエラーになる', () => {
    const start_date = new Date('2024-12-31T00:00:00Z');
    const end_date = new Date('2024-12-01T00:00:00Z');
    const sales_person_ids = ['SP001', 'SP002'];

    expect(() => 
      generateSalesPersonBehaviorAnalysisReport({
        start_date,
        end_date,
        sales_person_ids
      })
    ).toThrow(/開始日付/);
  });
});