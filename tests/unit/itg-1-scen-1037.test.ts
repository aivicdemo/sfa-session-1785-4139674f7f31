import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1037
  test('開始日が終了日より後の日付のとき処理がエラーになること', () => {
    const sales_rep_id = 'SR001';
    const start_date = new Date('2024-12-31T00:00:00Z');
    const end_date = new Date('2024-12-01T00:00:00Z');

    expect(() =>
      generateSalesActivityPatternAnalysisReport({
        sales_rep_id,
        start_date,
        end_date,
      })
    ).toThrow(/INVALID_DATE_RANGE/);
  });
});