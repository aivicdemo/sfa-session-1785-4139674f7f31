import { validateAndIntegratePurchaseResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-981
  test('[normal] 購買結果記録・営業データ統合機能 - 購買結果の品質検証ルールが複数件適用される場合に全て検証される', () => {
    const purchase_result_id = 'PR-20240115-001';
    const customer_id = '';
    const amount = -50000;
    const purchase_date = '2024-01-15T10:30:00';
    const product_id = 'PROD-001';

    const validation_rules = [
      {
        rule_id: 'VR-001',
        rule_name: '必須項目チェック',
        rule_type: 'mandatory_field',
        target_field: 'customer_id',
        order_sequence: 1,
      },
      {
        rule_id: 'VR-002',
        rule_name: '金額妥当性チェック',
        rule_type: 'amount_validity',
        target_field: 'amount',
        min_value: 0,
        order_sequence: 2,
      },
      {
        rule_id: 'VR-003',
        rule_name: '日付形式チェック',
        rule_type: 'date_format',
        target_field: 'purchase_date',
        expected_format: 'YYYY-MM-DD',
        order_sequence: 3,
      },
    ];

    const purchase_record = {
      purchase_result_id,
      customer_id,
      amount,
      purchase_date,
      product_id,
    };

    const result = validateAndIntegratePurchaseResult(
      purchase_record,
      validation_rules
    );

    expect(result.validation_results).toHaveLength(3);

    expect(result.validation_results[0]).toEqual({
      rule_id: 'VR-001',
      rule_name: '必須項目チェック',
      is_passed: false,
      error_message: '必須項目「顧客ID」が不足',
      execution_order: 1,
    });

    expect(result.validation_results[1]).toEqual({
      rule_id: 'VR-002',
      rule_name: '金額妥当性チェック',
      is_passed: false,
      error_message: '金額が負数のため不正',
      execution_order: 2,
    });

    expect(result.validation_results[2]).toEqual({
      rule_id: 'VR-003',
      rule_name: '日付形式チェック',
      is_passed: false,
      error_message: '日付形式が「YYYY-MM-DD」ではない',
      execution_order: 3,
    });

    expect(result.integration_status).toBe('validation_failed');
    expect(result.all_rules_executed).toBe(true);
    expect(result.total_rules_executed).toBe(3);
    expect(result.failed_rules_count).toBe(3);
  });
});