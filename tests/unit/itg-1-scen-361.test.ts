import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-361
  test('営業担当者IDが欠落しているとき、エラーが発生する', () => {
    const result = generateSalesRepBehaviorAnalysisReport({
      sales_rep_id: null,
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
    });

    expect(result).toHaveProperty('error_code', 'MISSING_SALES_REP_ID');
    expect(result).toHaveProperty('error_message', '営業担当者IDが指定されていません');
  });
});