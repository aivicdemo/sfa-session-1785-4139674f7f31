import { determineAndMergeDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1083
  test('データ品質ルールが適用されていないとき、エラーが発生する', () => {
    const inputCustomers = [
      {
        customer_id: 'C001',
        company_name: 'テスト株式会社',
        address: '東京都渋谷区1-2-3',
        phone: '03-1234-5678',
        email: 'contact@test.co.jp',
      },
      {
        customer_id: 'C002',
        company_name: 'テスト株式会社',
        address: '東京都渋谷区1-2-3',
        phone: '03-1234-5679',
        email: 'info@test.co.jp',
      },
    ];

    const emptyQualityRules = [];

    expect(() =>
      determineAndMergeDuplicateCustomers(inputCustomers, emptyQualityRules)
    ).toThrow(/データ品質ルール/);
  });
});