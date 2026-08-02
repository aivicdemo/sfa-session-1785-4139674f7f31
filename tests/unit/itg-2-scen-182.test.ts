import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-182
  test('検証結果の重度度スコアが閾値と同じとき、その優先度が割り当てられる', () => {
    const validation_record = {
      id: 'rec-001',
      customer_name: '',
      customer_id: 'cust-123',
      contact_date: '2024-01-15',
      amount: 50000,
    };

    const validation_rules = [
      {
        rule_id: 'rule-001',
        field_name: 'customer_name',
        rule_type: 'required',
        severity_threshold: 80,
        priority_mapping: {
          80: 'HIGH',
          60: 'MEDIUM',
          40: 'LOW',
        },
      },
    ];

    const result = validateSalesDataQuality(validation_record, validation_rules);

    expect(result.severity_score).toBe(80);
    expect(result.priority).toBe('HIGH');
    expect(result.is_passed).toBe(false);
    expect(result.failed_rules).toContain('rule-001');
  });
});