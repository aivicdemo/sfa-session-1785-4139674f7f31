import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-658
  test('フォローアップ成功率の計算に用いるデータソース（営業活動ログテーブル）が欠落の場合、エラーとなる', () => {
    const sales_person_id = 'SP001';
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');

    const mockDataSource = {
      sales_activity_log_table: null,
    };

    expect(() =>
      generateSalesActivityPatternReport(
        sales_person_id,
        analysis_period_start,
        analysis_period_end,
        mockDataSource
      )
    ).toThrow(/営業活動ログテーブル/);
  });
});