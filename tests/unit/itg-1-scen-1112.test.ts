import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1112
  test('[error] 営業活動ログデータが存在しないとき、処理がエラーになること', () => {
    const sales_rep_id = 'SR-001';

    expect(() => {
      generateSalesActivityPatternReport({
        sales_rep_id,
        activity_logs: [],
      });
    }).toThrow(/ACTIVITY_LOG_NOT_FOUND/);
  });
});