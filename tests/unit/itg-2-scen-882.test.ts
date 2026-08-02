import { describe, test, expect } from '@jest/globals';
import { executeIntegrationJudgment } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-882
  test('重複顧客IDが欠けているとき、処理は失敗する', () => {
    const inputData = {
      duplicateCustomerId: null,
      customerName: '株式会社テスト',
      emailAddress: 'test@example.com',
      address: '東京都渋谷区1-1-1',
      phoneNumber: '03-1234-5678',
    };

    expect(() => executeIntegrationJudgment(inputData)).toThrow(/重複顧客ID/);
  });
});