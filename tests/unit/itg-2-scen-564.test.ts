import { applyNormalizationRules } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-564
  test('正規化ルール適用条件が満たされないとき、そのルールはスキップされて次のルールが適用される', () => {
    const rules = [
      {
        rule_id: 'RULE_001',
        rule_name: '電話番号ハイフン削除',
        apply_condition: (data: any) => data.phone_number !== undefined && data.phone_number !== null,
        transformation: (value: string) => value.replace(/-/g, ''),
        target_field: 'phone_number',
      },
      {
        rule_id: 'RULE_002',
        rule_name: '会社名空白削除',
        apply_condition: (data: any) => data.company_name !== undefined && data.company_name !== null && data.company_name.includes(' '),
        transformation: (value: string) => value.replace(/\s/g, ''),
        target_field: 'company_name',
      },
      {
        rule_id: 'RULE_003',
        rule_name: '郵便番号ハイフン削除',
        apply_condition: (data: any) => data.postal_code !== undefined && data.postal_code !== null,
        transformation: (value: string) => value.replace(/-/g, ''),
        target_field: 'postal_code',
      },
    ];

    const input_customer_data = {
      customer_id: '001',
      name: '山田太郎',
      email: 'yamada@example.com',
    };

    const result = applyNormalizationRules(input_customer_data, rules);

    expect(result.normalized_data).toEqual({
      customer_id: '001',
      name: '山田太郎',
      email: 'yamada@example.com',
    });

    expect(result.applied_rules).toEqual([]);

    expect(result.skipped_rules).toHaveLength(3);
    expect(result.skipped_rules[0]).toEqual({
      rule_id: 'RULE_001',
      rule_name: '電話番号ハイフン削除',
      skip_reason: '適用条件不満足によりスキップ',
    });
    expect(result.skipped_rules[1]).toEqual({
      rule_id: 'RULE_002',
      rule_name: '会社名空白削除',
      skip_reason: '適用条件不満足によりスキップ',
    });
    expect(result.skipped_rules[2]).toEqual({
      rule_id: 'RULE_003',
      rule_name: '郵便番号ハイフン削除',
      skip_reason: '適用条件不満足によりスキップ',
    });

    expect(result.normalization_log).toContain('電話番号ハイフン削除: 適用条件不満足によりスキップ');
    expect(result.normalization_log).toContain('会社名空白削除: 適用条件不満足によりスキップ');
    expect(result.normalization_log).toContain('郵便番号ハイフン削除: 適用条件不満足によりスキップ');
  });
});