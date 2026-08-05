import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-145
  test('開始日が終了日より後のとき分析処理が中止される', () => {
    const start_date = new Date('2024-01-31T00:00:00Z');
    const end_date = new Date('2024-01-01T00:00:00Z');
    const sales_rep_ids = ['SR001'];

    expect(() =>
      generateSalesActivityPatternAnalysisReport({
        start_date,
        end_date,
        sales_rep_ids,
      })
    ).toThrow(/開始日は終了日以前である必要があります/);
  });
});