import { detectCustomerInconsistencies } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複・不整合検出と正規化ルール適用による統合判定', () => {
  // SCEN-361
  test('複数の不整合パターンが検出された場合、全て記録される', async () => {
    const registeredRecord = {
      customerId: 'C001',
      email: 'user@example.com',
      phone: '09012345678',
      address: '東京都渋谷区',
    };

    const inputRecord = {
      customerId: 'C001',
      email: 'user.new@example.com',
      phone: '09087654321',
      address: '東京都新宿区',
    };

    const result = await detectCustomerInconsistencies(registeredRecord, inputRecord);

    expect(result.inconsistencies).toHaveLength(3);

    expect(result.inconsistencies[0]).toEqual({
      fieldName: 'email',
      inconsistencyType: 'value_mismatch',
      registeredValue: 'user@example.com',
      inputValue: 'user.new@example.com',
    });

    expect(result.inconsistencies[1]).toEqual({
      fieldName: 'phone',
      inconsistencyType: 'value_mismatch',
      registeredValue: '09012345678',
      inputValue: '09087654321',
    });

    expect(result.inconsistencies[2]).toEqual({
      fieldName: 'address',
      inconsistencyType: 'value_mismatch',
      registeredValue: '東京都渋谷区',
      inputValue: '東京都新宿区',
    });
  });
});