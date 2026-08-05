import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-696
  test('営業活動ログが空配列のとき行動パターン抽出処理がエラーになる', () => {
    const sales_person_id = 'SP001';
    const activity_logs: never[] = [];

    expect(() =>
      generateSalesActivityPatternReport(sales_person_id, activity_logs)
    ).toThrow(/ACTIVITY_LOG_EMPTY/);
  });
});