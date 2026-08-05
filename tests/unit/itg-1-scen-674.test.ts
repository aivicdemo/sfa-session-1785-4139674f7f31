import { analyzeAndReportSalesPersonBehavior } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-674: 営業担当者IDが null のとき分析対象の特定に失敗しエラーになる', () => {
    const input_sales_person_id = null;
    const input_analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const input_analysis_period_end = new Date('2024-01-31T23:59:59Z');

    expect(() =>
      analyzeAndReportSalesPersonBehavior({
        sales_person_id: input_sales_person_id,
        analysis_period_start: input_analysis_period_start,
        analysis_period_end: input_analysis_period_end,
      })
    ).toThrow(/営業担当者ID/);
  });
});