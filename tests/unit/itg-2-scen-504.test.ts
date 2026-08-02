import { judgeCustomerDuplicateAfterNormalization } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-504
  test('顧客名の正規化ルール適用後、完全一致で重複と判定される', () => {
    const customer1 = {
      customer_id: 'CUST001',
      customer_name: '　ＡＢＣ　　株式会社　',
      address: '東京都渋谷区',
    };

    const customer2 = {
      customer_id: 'CUST002',
      customer_name: 'abc株式会社',
      address: '東京都渋谷区',
    };

    const result = judgeCustomerDuplicateAfterNormalization(customer1, customer2);

    expect(result).toEqual({
      isDuplicate: true,
      duplicate_level: '完全一致',
      normalized_name_1: 'abc株式会社',
      normalized_name_2: 'abc株式会社',
      recommended_action: '統合推奨',
    });
  });
});