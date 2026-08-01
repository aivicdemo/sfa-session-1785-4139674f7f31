import { evaluateFailureFactorApproval } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-692
  test('成功・失敗要因の抽出と承認基準判定機能 - ワークショップから抽出された失敗要因が営業部長の承認基準を満たすとき、承認可能な状態として評価される', () => {
    const extracted_failure_factors = [
      {
        failure_factor_id: 'FF001',
        category: 'customer_engagement',
        importance_score: 8.5,
        improvement_plan: '顧客接触頻度を週1回から週2回に増加させ、提案内容の事前準備を強化する'
      },
      {
        failure_factor_id: 'FF002',
        category: 'proposal_timing',
        importance_score: 7.2,
        improvement_plan: '初回接触後3営業日以内に提案資料を送付し、反応待機期間を短縮する'
      }
    ];

    const approval_criteria = {
      minimum_importance_score: 7.0,
      require_improvement_plan: true,
      valid_categories: ['customer_engagement', 'proposal_timing', 'follow_up_consistency', 'needs_analysis']
    };

    const result = evaluateFailureFactorApproval(
      extracted_failure_factors,
      approval_criteria
    );

    expect(result.approvalStatus).toBe('APPROVABLE');
    expect(result.approvalJudgment).toBe(true);
    expect(result.evaluated_factors).toHaveLength(2);
    expect(result.evaluated_factors[0]).toEqual({
      failure_factor_id: 'FF001',
      meets_criteria: true
    });
    expect(result.evaluated_factors[1]).toEqual({
      failure_factor_id: 'FF002',
      meets_criteria: true
    });
  });
});