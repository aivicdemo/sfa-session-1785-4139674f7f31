import { generateSalesAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-345
  test('分析対象期間の開始日が終了日より後のとき、エラーが発生する', () => {
    const start_date = new Date('2024-12-31T00:00:00Z');
    const end_date = new Date('2024-12-01T00:00:00Z');

    expect(() =>
      generateSalesAnalysisReport({
        start_date,
        end_date,
        sales_rep_ids: ['rep_001'],
      })
    ).toThrow(/INVALID_DATE_RANGE/);
  });
});