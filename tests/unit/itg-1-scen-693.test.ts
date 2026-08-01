import { judgeApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-693
  test('成功・失敗要因の抽出と承認基準判定機能 - 抽出された要因が承認基準スコアちょうど境界値のとき、承認可能と判定される', () => {
    const approval_threshold = 70.0;
    const extracted_factor_score = 70.0;

    const result = judgeApprovalCriteria({
      score: extracted_factor_score,
      approval_threshold: approval_threshold,
    });

    expect(result).toEqual({
      is_approvable: true,
      status: '承認対象',
    });
  });
});