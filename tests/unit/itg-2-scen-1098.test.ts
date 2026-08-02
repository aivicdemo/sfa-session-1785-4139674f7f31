import { applyNormalizationRulesWithTracking } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-1098
  test('正規化ルール適用後に属性の値が変更されるとき、変更内容が追跡可能に記録される', () => {
    const recordId = 'cust_001';
    const changedAt = '2024-01-15T10:30:45Z';
    const ruleApplied = 'normalize_customer_name';

    const inputData = {
      recordId,
      customer_name: '太郎　山田',
      address: '東京都　渋谷区',
      phone_number: '090-1234-5678'
    };

    const result = applyNormalizationRulesWithTracking(inputData);

    expect(result.recordId).toBe(recordId);
    expect(result.changedAt).toBe(changedAt);
    expect(result.ruleApplied).toBe(ruleApplied);
    expect(result.changeDetails).toEqual([
      {
        attribute: 'customer_name',
        beforeValue: '太郎　山田',
        afterValue: '太郎山田'
      },
      {
        attribute: 'address',
        beforeValue: '東京都　渋谷区',
        afterValue: '東京都渋谷区'
      },
      {
        attribute: 'phone_number',
        beforeValue: '090-1234-5678',
        afterValue: '09012345678'
      }
    ]);
    expect(result.normalizedData.customer_name).toBe('太郎山田');
    expect(result.normalizedData.address).toBe('東京都渋谷区');
    expect(result.normalizedData.phone_number).toBe('09012345678');
  });
});