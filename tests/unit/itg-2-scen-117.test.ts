import { describe, test, expect } from '@jest/globals';
import { mergeCustomerDuplicate } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-117
  test('統合対象データの顧客IDが欠落している場合、エラーとなる', () => {
    const targetRecordWithMissingCustomerId = {
      customerId: null,
      customerName: '株式会社テスト',
      email: 'test@example.com',
      phone: '03-1234-5678',
      address: '東京都渋谷区',
    };

    expect(() =>
      mergeCustomerDuplicate(targetRecordWithMissingCustomerId)
    ).toThrow(/顧客ID/);
  });
});