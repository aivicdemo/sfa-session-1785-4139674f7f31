import { describe, test, expect } from '@jest/globals';
import { extractBehaviorPatterns } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-695
  test('営業活動ログデータが null のとき行動パターン抽出処理がエラーになる', () => {
    const salesPerson_id = 'sales_001';
    const activity_logs = null;

    expect(() => {
      extractBehaviorPatterns(activity_logs, salesPerson_id);
    }).toThrow(/InvalidActivityDataError/);
  });
});