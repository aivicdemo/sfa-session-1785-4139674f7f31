import { describe, test, expect, beforeEach } from '@jest/globals';
import { detectDuplicateAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-519
  test('重複スコアが100超過のとき、エラーが発生する', () => {
    const customer_a = {
      customer_id: 'CUST001',
      customer_name: '株式会社ABC',
      email: 'contact@abc.co.jp',
      phone: '03-1234-5678',
      address: '東京都渋谷区'
    };

    const customer_b = {
      customer_id: 'CUST002',
      customer_name: '株式会社ABC',
      email: 'contact@abc.co.jp',
      phone: '03-1234-5678',
      address: '東京都渋谷区'
    };

    const duplicate_score = 101;

    expect(() => {
      detectDuplicateAndJudgeIntegration(
        customer_a,
        customer_b,
        duplicate_score
      );
    }).toThrow(/重複スコア/);
  });
});