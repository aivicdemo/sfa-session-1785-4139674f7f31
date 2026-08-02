import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-469: 正規化ルール定義がnullである場合、エラーが発生する', () => {
    const customerData = [
      {
        customerId: 'CUST001',
        customerName: '株式会社テスト',
        addressPrefecture: '東京都',
        addressCity: '千代田区',
        phoneNumber: '03-1234-5678'
      },
      {
        customerId: 'CUST002',
        customerName: '株式会社テスト',
        addressPrefecture: '東京都',
        addressCity: '千代田区',
        phoneNumber: '03-1234-5678'
      }
    ];

    expect(() => {
      detectDuplicateCustomersAndJudgeIntegration(customerData, null);
    }).toThrow(/NORMALIZATION_RULE_NOT_DEFINED/);
  });
});