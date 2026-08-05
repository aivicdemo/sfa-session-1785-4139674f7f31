import { validateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-966
  test('成功要因・失敗要因の抽出と承認基準検証 - 承認基準チェック処理を同じ入力で2回実行しても同じ結果が得られる', () => {
    const salesCaseId = 'SALES-001';
    const successFactorScore = 78;
    const failureFactorScore = 22;
    const approvalThreshold = 75;

    const firstResult = validateApprovalCriteria({
      salesCaseId,
      successFactorScore,
      failureFactorScore,
      approvalThreshold,
    });

    const secondResult = validateApprovalCriteria({
      salesCaseId,
      successFactorScore,
      failureFactorScore,
      approvalThreshold,
    });

    expect(firstResult.approved).toBe(true);
    expect(secondResult.approved).toBe(true);
    expect(firstResult.approved).toEqual(secondResult.approved);

    expect(firstResult.reason).toBe('成功要因スコアが閾値75以上のため承認');
    expect(secondResult.reason).toBe('成功要因スコアが閾値75以上のため承認');
    expect(firstResult.reason).toEqual(secondResult.reason);

    expect(firstResult.score).toBe(78);
    expect(secondResult.score).toBe(78);
    expect(firstResult.score).toEqual(secondResult.score);
  });
});