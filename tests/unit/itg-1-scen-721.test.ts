import { validateApprovalCriterion } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-721
  test('成功・失敗要因の抽出と承認基準判定機能 - ワークショップ完了日時がnullのとき、承認基準判定が実行されない', () => {
    const salesActivityId = 'ACT-20240115-001';
    const successFactors = ['顧客との信頼構築', '提案タイミングの最適化'];
    const failureFactors = ['初期アプローチの不備'];
    const workshopCompletionDateTime = null;

    const result = validateApprovalCriterion({
      salesActivityId,
      successFactors,
      failureFactors,
      workshopCompletionDateTime,
    });

    expect(result).toEqual({
      status: 'SKIPPED',
      approvalStatus: null,
      reason: 'ワークショップ完了日時が設定されていません',
      executedAt: null,
      isApprovalExecuted: false,
    });

    expect(result.isApprovalExecuted).toBe(false);
    expect(result.approvalStatus).toBeNull();
    expect(result.status).toBe('SKIPPED');
  });
});