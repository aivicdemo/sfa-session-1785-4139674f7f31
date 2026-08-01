import { evaluateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-694
  test('成功・失敗要因の抽出と承認基準判定機能 - 抽出された要因が承認基準スコア直下のとき、承認不可と判定される', () => {
    const approvalThreshold = 100;
    const extractedFactorScore = 99;

    const result = evaluateApprovalCriteria({
      factorScore: extractedFactorScore,
      approvalThreshold: approvalThreshold,
    });

    expect(result.approved).toBe(false);
    expect(result.reason).toMatch(/承認基準に達していません/);
    expect(result.factorScore).toBe(99);
    expect(result.approvalThreshold).toBe(100);
  });
});