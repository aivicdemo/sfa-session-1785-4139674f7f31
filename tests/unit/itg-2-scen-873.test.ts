import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-873
  test('同じ入力条件で正規化を2回実行したとき、同じ結果が返される', () => {
    const input_customer_data = {
      customer_name: '山田　太郎',
      phone_number: '090-1234-5678',
      address: '東京都渋谷区道玄坂１－２－３',
    };

    const result_a = normalizeCustomerData(input_customer_data);
    const result_b = normalizeCustomerData(input_customer_data);

    expect(result_a).toEqual(result_b);
    expect(result_a.normalized_customer_name).toBe('山田太郎');
    expect(result_a.normalized_phone_number).toBe('09012345678');
    expect(result_a.normalized_address).toBe('東京都渋谷区道玄坂1-2-3');
    expect(result_b.normalized_customer_name).toBe('山田太郎');
    expect(result_b.normalized_phone_number).toBe('09012345678');
    expect(result_b.normalized_address).toBe('東京都渋谷区道玄坂1-2-3');
  });
});