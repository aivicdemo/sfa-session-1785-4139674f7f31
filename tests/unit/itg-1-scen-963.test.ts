import { validateSuccessFailureFactorsAgainstApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-963
  test('成功要因・失敗要因の抽出と承認基準検証 - ワークショップで抽出された成功要因と失敗要因の組み合わせが営業部長の承認基準を満たすと判定される', () => {
    const successFactors = [
      {
        name: '顧客ニーズの早期把握',
        category: '営業プロセス',
        score: 40,
      },
      {
        name: '提案資料の質が高い',
        category: '営業プロセス',
        score: 35,
      },
    ];

    const failureFactors = [
      {
        name: '初期接触の遅延',
        category: '営業プロセス',
        score: 15,
      },
      {
        name: '競合他社との差別化不足',
        category: '営業プロセス',
        score: 10,
      },
    ];

    const approvalCriteria = {
      min_success_factors: 2,
      min_failure_factors: 2,
      min_total_score: 70,
      required_category: '営業プロセス',
    };

    const result = validateSuccessFailureFactorsAgainstApprovalCriteria(
      successFactors,
      failureFactors,
      approvalCriteria
    );

    expect(result.is_approved).toBe(true);
    expect(result.total_score).toBe(75);
    expect(result.success_factors_count).toBe(2);
    expect(result.failure_factors_count).toBe(2);
    expect(result.all_factors_in_required_category).toBe(true);
    expect(result.approval_status).toBe('承認可能');
  });
});