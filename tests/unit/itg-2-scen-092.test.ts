import { validateSalesDataWithMultipleRules } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-092
  test('検証対象のデータ品質ルールが複数件の場合、全ルールで検証する', () => {
    const salesData = {
      customer_name: '山田太郎',
      email_address: 'yamada.taro@example.com',
      phone_number: '09012345678'
    };

    const qualityRules = [
      {
        rule_id: 'RULE_001',
        rule_name: '顧客名必須チェック',
        target_field: 'customer_name',
        rule_type: 'required',
        validation_criteria: { required: true }
      },
      {
        rule_id: 'RULE_002',
        rule_name: 'メールアドレス形式チェック',
        target_field: 'email_address',
        rule_type: 'format',
        validation_criteria: { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }
      },
      {
        rule_id: 'RULE_003',
        rule_name: '電話番号数字チェック',
        target_field: 'phone_number',
        rule_type: 'format',
        validation_criteria: { pattern: '^[0-9]+$' }
      }
    ];

    const result = validateSalesDataWithMultipleRules(salesData, qualityRules);

    expect(result.total_rules_applied).toBe(3);
    expect(result.passed_count).toBe(3);
    expect(result.failed_count).toBe(0);
    expect(result.validation_results).toHaveLength(3);
    
    expect(result.validation_results[0]).toEqual({
      rule_id: 'RULE_001',
      rule_name: '顧客名必須チェック',
      target_field: 'customer_name',
      status: 'PASSED',
      error_message: null
    });

    expect(result.validation_results[1]).toEqual({
      rule_id: 'RULE_002',
      rule_name: 'メールアドレス形式チェック',
      target_field: 'email_address',
      status: 'PASSED',
      error_message: null
    });

    expect(result.validation_results[2]).toEqual({
      rule_id: 'RULE_003',
      rule_name: '電話番号数字チェック',
      target_field: 'phone_number',
      status: 'PASSED',
      error_message: null
    });

    expect(result.validation_results.every(
      (r: { status: string }) => r.status === 'PASSED'
    )).toBe(true);
  });
});