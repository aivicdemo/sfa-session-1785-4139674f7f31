import { normalizeCustomerData } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-265
  test('正規化ルールが適用順序と逆順で配列されているとき、正規化処理が定義順序で実行される', () => {
    const executionLog: string[] = [];

    const rule1_full_to_half_space = {
      rule_id: 'RULE_001',
      rule_name: '全角スペースを半角スペースに変換',
      rule_order: 1,
      apply: (input: string) => {
        executionLog.push('RULE_001');
        return input.replace(/　/g, ' ');
      },
    };

    const rule2_trim = {
      rule_id: 'RULE_002',
      rule_name: '前後の空白をトリム',
      rule_order: 2,
      apply: (input: string) => {
        executionLog.push('RULE_002');
        return input.trim();
      },
    };

    const rule3_uppercase = {
      rule_id: 'RULE_003',
      rule_name: '英字を大文字に統一',
      rule_order: 3,
      apply: (input: string) => {
        executionLog.push('RULE_003');
        return input.toUpperCase();
      },
    };

    const normalization_rules_reversed = [rule3_uppercase, rule2_trim, rule1_full_to_half_space];

    const input_data = '  abc　def  ';

    const result = normalizeCustomerData({
      input: input_data,
      normalization_rules: normalization_rules_reversed,
      execution_log: executionLog,
    });

    expect(result.normalized_output).toBe('ABC DEF');
    expect(executionLog).toEqual(['RULE_001', 'RULE_002', 'RULE_003']);
  });
});