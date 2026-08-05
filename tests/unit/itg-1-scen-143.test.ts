import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-143
  test('分析期間の終了日が空（null）のときレポート生成が失敗する', () => {
    const input = {
      start_date: '2024-01-01',
      end_date: null,
      sales_person_name: '営業太郎'
    };

    expect(() => generateSalesActivityAnalysisReport(input)).toThrow(/終了日/);
  });
});