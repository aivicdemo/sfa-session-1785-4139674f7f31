import { judgeApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-697
  test('成功・失敗要因の抽出と承認基準判定機能 - 成功要因が1件のとき、承認基準判定が正しく処理される', () => {
    const input_success_factors = ['既存顧客との関係構築'];
    const input_failure_factors: string[] = [];

    const result = judgeApprovalCriteria({
      success_factors: input_success_factors,
      failure_factors: input_failure_factors,
    });

    expect(result.approval_status).toBe('承認対象外');
    expect(result.status_code).toBe('0001');
    expect(result.judgment_reason).toBe(
      '成功要因が基準値（2件以上）に満たない'
    );
  });
});