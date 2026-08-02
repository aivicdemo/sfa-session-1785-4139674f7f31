import { applyNormalizationRules } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  test('SCEN-223: 正規化ルール適用エンジン - ルール適用順序の依存関係が満たされるとき、正しい順序で適用される', () => {
    // 準備: テスト用ルール定義（依存関係あり）
    const rule_a = {
      rule_id: 'rule_a',
      rule_name: 'trim_whitespace',
      rule_type: 'trim',
      dependencies: [],
      execution_order: 1,
    };

    const rule_b = {
      rule_id: 'rule_b',
      rule_name: 'validate_name_format',
      rule_type: 'validation',
      dependencies: ['rule_a'],
      execution_order: 2,
    };

    const rule_c = {
      rule_id: 'rule_c',
      rule_name: 'finalize_normalization',
      rule_type: 'finalization',
      dependencies: ['rule_b'],
      execution_order: 3,
    };

    const normalization_rules = [rule_a, rule_b, rule_c];

    // 入力データ（前後に空白あり）
    const input_data = {
      customer_name: ' 山田太郎 ',
    };

    // 実行
    const result = applyNormalizationRules({
      input_data: input_data,
      normalization_rules: normalization_rules,
    });

    // 検証
    // 1. 最終的な出力が正しい（前後の空白が除去されている）
    expect(result.normalized_data.customer_name).toBe('山田太郎');

    // 2. ルール適用順序が正しい（依存関係に基づいて実行されている）
    expect(result.applied_rules_log).toEqual([
      expect.objectContaining({
        rule_id: 'rule_a',
        execution_step: 1,
        input_value: ' 山田太郎 ',
        output_value: '山田太郎',
      }),
      expect.objectContaining({
        rule_id: 'rule_b',
        execution_step: 2,
        input_value: '山田太郎',
        output_value: '山田太郎',
      }),
      expect.objectContaining({
        rule_id: 'rule_c',
        execution_step: 3,
        input_value: '山田太郎',
        output_value: '山田太郎',
      }),
    ]);

    // 3. 各ステップが依存関係順に実行されたことを確認
    expect(result.applied_rules_log[0].rule_id).toBe('rule_a');
    expect(result.applied_rules_log[1].rule_id).toBe('rule_b');
    expect(result.applied_rules_log[2].rule_id).toBe('rule_c');

    // 4. ログの長さが3（全ルール実行）
    expect(result.applied_rules_log.length).toBe(3);

    // 5. すべてのルール実行が成功したことを確認
    expect(result.normalization_status).toBe('completed');
  });
});