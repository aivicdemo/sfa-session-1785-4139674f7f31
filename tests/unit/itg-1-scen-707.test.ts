import { evaluateSuccessFailureFactorsAgainstApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-707
  test('要因の信頼度スコアが承認基準の最小値未満のとき、承認不可と判定される', () => {
    const approval_criteria_min_confidence_score = 0.7;
    const factor_confidence_score = 0.69;
    const factor_id = 'factor_001';
    const factor_name = '初回接触頻度が高い';
    const factor_type = 'success';

    const input_factors = [
      {
        factor_id: factor_id,
        factor_name: factor_name,
        factor_type: factor_type,
        confidence_score: factor_confidence_score,
      },
    ];

    const input_approval_criteria = {
      min_confidence_score: approval_criteria_min_confidence_score,
      required_evidence_count: 5,
      min_correlation_coefficient: 0.5,
    };

    const result = evaluateSuccessFailureFactorsAgainstApprovalCriteria(
      input_factors,
      input_approval_criteria
    );

    expect(result.factors_approval_results).toHaveLength(1);

    const approval_result = result.factors_approval_results[0];
    expect(approval_result.factor_id).toBe(factor_id);
    expect(approval_result.approval_status).toMatch(/rejected|unapproved/);
    expect(approval_result.rejection_reason).toContain('信頼度スコアが基準値未満');
    expect(approval_result.is_approved).toBe(false);
  });
});