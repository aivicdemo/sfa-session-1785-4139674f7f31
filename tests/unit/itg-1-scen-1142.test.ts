import { analyzeAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1142
  test('成約件数が負の値のとき、処理がエラーになること', () => {
    const invalid_deal_count = -5;
    const sales_rep_id = 'REP001';
    const analysis_period_start = '2024-01-01';
    const analysis_period_end = '2024-01-31';

    expect(() =>
      analyzeAndGenerateReport({
        sales_rep_id,
        deal_count: invalid_deal_count,
        period_start: analysis_period_start,
        period_end: analysis_period_end,
      })
    ).toThrow(/成約件数/);
  });
});