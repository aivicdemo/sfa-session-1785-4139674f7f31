import { judgeModificationRuleApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('修正ルール承認判定機能 - 複数件の修正ルール案に対する個別判定', () => {
  // SCEN-573
  test('承認対象の修正ルール案が複数件の場合、全件に対して個別に判定が実行される', async () => {
    const test_timestamp = new Date('2024-01-15T10:00:00Z');

    const modification_rules = [
      {
        rule_id: 'RULE_A_001',
        rule_name: '顧客名の空白削除',
        rule_type: 'name_normalization',
        rule_description: '顧客名の先頭・末尾・中間の空白を削除する',
        past_approval_count: 5,
        approval_status_before: 'pending'
      },
      {
        rule_id: 'RULE_B_001',
        rule_name: '電話番号ハイフン統一',
        rule_type: 'phone_format',
        rule_description: '電話番号をXXX-XXXX-XXXX形式に統一する',
        past_approval_count: 3,
        approval_status_before: 'pending'
      },
      {
        rule_id: 'RULE_C_001',
        rule_name: '郵便番号フォーマット正規化',
        rule_type: 'postal_code_format',
        rule_description: '郵便番号をXXX-XXXX形式に統一する',
        past_approval_count: 2,
        approval_status_before: 'pending'
      }
    ];

    const approval_manager_id = 'MGR_001';
    const approval_context = {
      approval_batch_id: 'BATCH_2024_01_15',
      submitted_at: test_timestamp.toISOString(),
      approval_manager_id: approval_manager_id
    };

    const result = await judgeModificationRuleApproval(
      modification_rules,
      approval_context
    );

    expect(result.judgment_results).toHaveLength(3);
    expect(result.all_judgments_completed).toBe(true);
    expect(result.judgment_timestamp).toBe(test_timestamp.toISOString());

    const rule_a_result = result.judgment_results.find(
      (j: any) => j.rule_id === 'RULE_A_001'
    );
    expect(rule_a_result).toBeDefined();
    expect(rule_a_result.judgment_status).toBe('approval_recommended');
    expect(rule_a_result.judgment_rationale).toBe(
      '過去承認実績5件により基準適合'
    );
    expect(rule_a_result.approval_recommendation).toBe('approval_allowed');
    expect(rule_a_result.past_approval_evidence_count).toBe(5);

    const rule_b_result = result.judgment_results.find(
      (j: any) => j.rule_id === 'RULE_B_001'
    );
    expect(rule_b_result).toBeDefined();
    expect(rule_b_result.judgment_status).toBe('approval_recommended');
    expect(rule_b_result.judgment_rationale).toBe(
      '過去承認実績3件により基準適合'
    );
    expect(rule_b_result.approval_recommendation).toBe('approval_allowed');
    expect(rule_b_result.past_approval_evidence_count).toBe(3);

    const rule_c_result = result.judgment_results.find(
      (j: any) => j.rule_id === 'RULE_C_001'
    );
    expect(rule_c_result).toBeDefined();
    expect(rule_c_result.judgment_status).toBe('conditional_approval');
    expect(rule_c_result.judgment_rationale).toBe(
      '過去承認実績2件（件数少）、リスク判定が必要'
    );
    expect(rule_c_result.approval_recommendation).toBe('approval_with_verification');
    expect(rule_c_result.past_approval_evidence_count).toBe(2);

    const all_same_timestamp = result.judgment_results.every(
      (j: any) => j.judgment_timestamp === test_timestamp.toISOString()
    );
    expect(all_same_timestamp).toBe(true);

    const rule_ids_in_result = result.judgment_results.map(
      (j: any) => j.rule_id
    );
    expect(rule_ids_in_result).toEqual(
      expect.arrayContaining(['RULE_A_001', 'RULE_B_001', 'RULE_C_001'])
    );
  });
});