import { analyzeAndReportSalesPerformance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-611
  test('[error] 営業担当者IDが空文字列のときエラーになる', () => {
    expect(() =>
      analyzeAndReportSalesPerformance({
        sales_rep_id: '',
        analysis_period_start: '2024-01-01',
        analysis_period_end: '2024-01-31',
      })
    ).toThrow(/営業担当者ID/);
  });
});