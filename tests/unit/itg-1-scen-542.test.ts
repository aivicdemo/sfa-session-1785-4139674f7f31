import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-542
  test('営業活動ログデータが欠落している場合、エラーになる', () => {
    const sales_person_id = 'SA001';
    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';

    expect(() =>
      generateSalesActivityPatternReport({
        sales_person_id,
        analysis_start_date,
        analysis_end_date,
      })
    ).toThrow(/営業活動ログデータが見つかりません/);
  });
});