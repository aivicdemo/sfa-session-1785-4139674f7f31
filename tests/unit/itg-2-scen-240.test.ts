import { detectCustomerDuplicates } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-240
  test('重複候補が0件のとき、正規化ルール適用処理が呼び出されない', () => {
    const input_customer = {
      customer_id: 'C001',
      customer_name: '山田太郎',
      email: 'yamada@example.com',
      phone: '09012345678',
      address: '東京都渋谷区道玄坂1-2-3'
    };

    const result = detectCustomerDuplicates(input_customer);

    expect(result).toEqual({
      duplicate_candidates_count: 0,
      is_normalization_applied: false,
      duplicate_found: false,
      normalized_data: null
    });
  });
});