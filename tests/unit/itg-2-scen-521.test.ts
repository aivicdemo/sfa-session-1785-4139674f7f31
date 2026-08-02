import { detectDuplicateCustomersAndDecideIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ重複検知・統合判定機能', () => {
  // SCEN-521
  test('適用対象の正規化ルールが0件のとき、正規化なしで判定が実行される', () => {
    const recordA = {
      customer_id: 'CUST001',
      customer_name: '田中太郎',
      address: '東京都渋谷区1-2-3',
      phone: '09012345678',
    };

    const recordB = {
      customer_id: 'CUST002',
      customer_name: '  田中　太郎  ',
      address: '東京都 渋谷区 1-2-3',
      phone: '090-1234-5678',
    };

    const customers = [recordA, recordB];
    const normalization_rules = [];

    const result = detectDuplicateCustomersAndDecideIntegration({
      customers,
      normalization_rules,
      duplicate_detection_rules: [
        {
          rule_id: 'RULE001',
          matching_type: 'exact',
          target_fields: ['customer_name', 'address', 'phone'],
          priority: 1,
        },
      ],
    });

    expect(result.is_duplicate).toBe(false);
    expect(result.normalization_applied).toBe(false);
    expect(result.duplicate_reason).toBeUndefined();
    expect(result.normalized_data_used).toBe(false);
    expect(result.record_a_original).toEqual(recordA);
    expect(result.record_b_original).toEqual(recordB);
  });
});