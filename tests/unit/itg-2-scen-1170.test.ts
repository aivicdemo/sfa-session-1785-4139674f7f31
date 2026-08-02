import { detectDuplicateCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1170
  test('重複候補が0件の場合、空のリストが返される', () => {
    const input = {
      customer_id: 9999,
      customer_name: '一意な顧客名',
      customer_email: 'unique.customer@example.com',
      customer_phone: '09012345678',
    };

    const result = detectDuplicateCustomers(input);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});