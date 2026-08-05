import { generateSalesPersonActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1117
  test('営業案件データが存在しないとき、エラーが返されること', () => {
    const start_date = new Date('2024-01-01T00:00:00Z');
    const end_date = new Date('2024-01-31T23:59:59Z');
    const sales_deals = [];

    expect(() =>
      generateSalesPersonActionPatternReport({
        start_date,
        end_date,
        sales_deals,
      })
    ).toThrow(/指定された期間内に営業案件データが存在しません/);
  });
});