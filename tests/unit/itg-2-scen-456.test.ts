import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  test('SCEN-456: 顧客名が空文字列である場合、該当属性を検証対象から除外する', () => {
    const customer1 = {
      customer_id: 'CUST001',
      customer_name: '',
      address: '東京都渋谷区1-1-1',
      phone_number: '03-1234-5678',
    };

    const customer2 = {
      customer_id: 'CUST002',
      customer_name: '異なる会社名',
      address: '東京都渋谷区1-1-1',
      phone_number: '03-1234-5678',
    };

    const result = detectDuplicateCustomers([customer1, customer2]);

    expect(result).toEqual({
      is_duplicate: true,
      excluded_attributes: ['customer_name'],
      matching_attributes: ['address', 'phone_number'],
      duplicate_pair: {
        customer_id_1: 'CUST001',
        customer_id_2: 'CUST002',
      },
    });
  });
});