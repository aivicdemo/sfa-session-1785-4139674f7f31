import { detectDuplicateCustomersAndJudgeIntegration } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-396
  test('電話番号のハイフンを統一する正規化ルールが適用される場合、異なるハイフン形式の3つの電話番号がすべて統一ハイフン形式に正規化され、重複検出ロジックが3つのレコードを同一の顧客として認識し、統合判定ステータスが統合対象として返される', () => {
    const input_customer_records = [
      {
        customer_id: 'CUST001',
        customer_name: '田中太郎',
        phone_number: '09-1234-5678',
      },
      {
        customer_id: 'CUST002',
        customer_name: '田中太郎',
        phone_number: '091234-5678',
      },
      {
        customer_id: 'CUST003',
        customer_name: '田中太郎',
        phone_number: '0912345678',
      },
    ];

    const normalization_rules = [
      {
        field_name: 'phone_number',
        rule_type: 'standardize_hyphen',
        target_format: '##-##-##-####',
      },
    ];

    const result = detectDuplicateCustomersAndJudgeIntegration(
      input_customer_records,
      normalization_rules
    );

    expect(result.normalized_records).toEqual([
      {
        customer_id: 'CUST001',
        customer_name: '田中太郎',
        phone_number: '09-12-34-5678',
      },
      {
        customer_id: 'CUST002',
        customer_name: '田中太郎',
        phone_number: '09-12-34-5678',
      },
      {
        customer_id: 'CUST003',
        customer_name: '田中太郎',
        phone_number: '09-12-34-5678',
      },
    ]);

    expect(result.duplicate_groups).toHaveLength(1);
    expect(result.duplicate_groups[0]).toEqual({
      group_id: expect.any(String),
      customer_ids: ['CUST001', 'CUST002', 'CUST003'],
      matching_key: 'phone_number',
      normalized_value: '09-12-34-5678',
    });

    expect(result.integration_judgment).toEqual({
      status: '統合対象',
      duplicate_group_count: 1,
      total_records_analyzed: 3,
      records_to_merge: ['CUST001', 'CUST002', 'CUST003'],
    });
  });
});