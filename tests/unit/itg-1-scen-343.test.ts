import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-343
  test('営業活動ログデータが存在しないとき、エラーが発生する', () => {
    const input = {
      sales_activity_logs: [],
      analysis_period_start: new Date('2024-01-01T00:00:00Z'),
      analysis_period_end: new Date('2024-01-31T23:59:59Z'),
    };

    expect(() =>
      generateSalesActivityPatternAnalysisReport(input)
    ).toThrow(/営業活動ログデータが存在しません/);
  });
});