import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-638
  test('年度をまたぐ期間で過去3ヶ月を計算する場合、正確に計算される', () => {
    const current_date = new Date('2024-01-15T00:00:00Z');
    const result = generateSalesRepBehaviorAnalysisReport({
      reference_date: current_date,
      analysis_period_months: 3,
    });

    const expected_start_date = new Date('2023-10-15T00:00:00Z');
    const expected_end_date = new Date('2024-01-15T00:00:00Z');

    expect(result.period_start).toEqual(expected_start_date);
    expect(result.period_end).toEqual(expected_end_date);
    expect(result.includes_fiscal_year_boundary).toBe(true);
  });
});