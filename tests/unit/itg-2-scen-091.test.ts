import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-091
  test('検証対象のデータ品質ルールが1件の場合、その1件のルールで検証する', () => {
    const qualityRules = [
      {
        rule_id: 'RULE_001',
        rule_name: 'customer_name_not_empty',
        rule_type: 'not_empty',
        target_field: 'customer_name',
        condition: 'customer_name != ""',
      },
    ];

    const salesDataSet = [
      {
        record_id: 'REC_001',
        customer_name: 'Example Corp',
        customer_code: 'CUST_001',
        sales_amount: 100000,
        sales_date: '2024-01-15',
      },
    ];

    const result = validateSalesData({
      quality_rules: qualityRules,
      sales_data: salesDataSet,
    });

    expect(result.rule_execution_count).toBe(1);
    expect(result.validation_status).toBe('pass');
    expect(result.passed_records).toBe(1);
    expect(result.failed_records).toBe(0);
  });
});