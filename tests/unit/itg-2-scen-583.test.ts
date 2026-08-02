import { judgeRuleApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('修正ルール承認判定機能', () => {
  // SCEN-583
  test('複数の異なるルール種別を含む修正ルール案に対して、全種別に対する個別の妥当性判定が実行される', () => {
    const rule_approval_input = {
      approval_user_id: 'user_qa_001',
      approval_user_role: 'data_quality_manager',
      rule_cases: [
        {
          rule_id: 'dedup_rule_001',
          rule_type: 'duplicate_removal',
          rule_name: '顧客名+郵便番号による重複判定',
          criteria_matched: ['criteria_001'],
          criteria_mismatched: [],
          predicted_impact_count: 1234,
          rule_definition: {
            match_fields: ['customer_name', 'postal_code'],
            match_logic: 'exact_match',
            merge_priority: 'keep_oldest'
          }
        },
        {
          rule_id: 'norm_rule_001',
          rule_type: 'normalization',
          rule_name: '住所表記の統一',
          criteria_matched: ['criteria_001'],
          criteria_mismatched: ['criteria_003'],
          predicted_impact_count: 567,
          rule_definition: {
            target_field: 'address',
            normalization_pattern: 'standardize_japanese_address',
            apply_condition: 'all_records'
          }
        },
        {
          rule_id: 'reconcile_rule_001',
          rule_type: 'inconsistency_resolution',
          rule_name: '部門コード・部門名対応関係の解決',
          criteria_matched: ['criteria_001'],
          criteria_mismatched: [],
          predicted_impact_count: 89,
          rule_definition: {
            primary_field: 'department_code',
            dependent_field: 'department_name',
            reconciliation_method: 'code_based'
          }
        }
      ]
    };

    const judgment_result = judgeRuleApproval(rule_approval_input);

    expect(judgment_result.is_authorized).toBe(true);
    expect(judgment_result.judgments).toHaveLength(3);

    const dedup_judgment = judgment_result.judgments[0];
    expect(dedup_judgment.rule_id).toBe('dedup_rule_001');
    expect(dedup_judgment.rule_type).toBe('duplicate_removal');
    expect(dedup_judgment.judgment_status).toBe('approved');
    expect(dedup_judgment.matched_criteria).toEqual(['criteria_001']);
    expect(dedup_judgment.unmatched_criteria).toEqual([]);
    expect(dedup_judgment.predicted_impact_count).toBe(1234);
    expect(dedup_judgment.judgment_rationale).toBe('重複排除基準①に合致');

    const norm_judgment = judgment_result.judgments[1];
    expect(norm_judgment.rule_id).toBe('norm_rule_001');
    expect(norm_judgment.rule_type).toBe('normalization');
    expect(norm_judgment.judgment_status).toBe('revision_required');
    expect(norm_judgment.matched_criteria).toEqual(['criteria_001']);
    expect(norm_judgment.unmatched_criteria).toEqual(['criteria_003']);
    expect(norm_judgment.predicted_impact_count).toBe(567);
    expect(norm_judgment.judgment_rationale).toBe('正規化基準③が不完全であり修正が必要');

    const reconcile_judgment = judgment_result.judgments[2];
    expect(reconcile_judgment.rule_id).toBe('reconcile_rule_001');
    expect(reconcile_judgment.rule_type).toBe('inconsistency_resolution');
    expect(reconcile_judgment.judgment_status).toBe('approved');
    expect(reconcile_judgment.matched_criteria).toEqual(['criteria_001']);
    expect(reconcile_judgment.unmatched_criteria).toEqual([]);
    expect(reconcile_judgment.predicted_impact_count).toBe(89);
    expect(reconcile_judgment.judgment_rationale).toBe('不整合解決基準①に合致');

    expect(judgment_result.overall_status).toBe('mixed');
    expect(judgment_result.total_predicted_impact).toBe(1890);
  });
});