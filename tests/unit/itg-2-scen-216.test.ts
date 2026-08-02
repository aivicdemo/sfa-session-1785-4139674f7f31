import { detectDuplicateAndMergeCustomers } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-216
  test('統合判定履歴にレコードが記録されるとき、判定日時が現在時刻で設定される', () => {
    const mock_current_timestamp = '2024-01-15T14:30:45Z';
    const mock_now_date = new Date(mock_current_timestamp);

    const now_spy = jest.spyOn(global, 'Date').mockImplementation(
      () => mock_now_date as any
    );

    try {
      const customer_records = [
        {
          customer_id: 'CUST001',
          customer_name: '株式会社A',
          email: 'contact@company-a.com',
          phone: '03-1234-5678',
          postal_code: '100-0001'
        },
        {
          customer_id: 'CUST002',
          customer_name: '株式会社Ａ',
          email: 'contact@company-a.com',
          phone: '03-1234-5678',
          postal_code: '100-0001'
        }
      ];

      const merge_rules = [
        {
          rule_id: 'RULE001',
          rule_name: '会社名正規表現マッチ',
          matching_fields: ['customer_name', 'email', 'phone'],
          merge_priority: 1
        }
      ];

      const quality_rules = [
        {
          rule_id: 'QR001',
          rule_name: '必須項目チェック',
          target_field: 'customer_name',
          validation_type: 'required'
        }
      ];

      const result = detectDuplicateAndMergeCustomers({
        customer_records,
        merge_rules,
        quality_rules,
        execution_timestamp: mock_current_timestamp
      });

      expect(result).toBeDefined();
      expect(result.integration_history).toBeDefined();
      expect(Array.isArray(result.integration_history)).toBe(true);
      expect(result.integration_history.length).toBeGreaterThanOrEqual(1);

      const recorded_history = result.integration_history[0];
      expect(recorded_history).toBeDefined();
      expect(recorded_history.judgment_datetime).toBe(mock_current_timestamp);
      expect(recorded_history.judgment_datetime).toEqual('2024-01-15T14:30:45Z');
    } finally {
      now_spy.mockRestore();
    }
  });
});