import { evaluateApprovalCriteria } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-695
  test('成功・失敗要因の抽出スコアが承認基準スコア直上のとき、承認可能と判定される', () => {
    const approval_criteria_score = 70;
    const extracted_factor_score = 70;

    const result = evaluateApprovalCriteria({
      approval_criteria_score,
      extracted_factor_score,
    });

    expect(result.is_approved).toBe(true);
    expect(result.approval_status).toBe('承認可能');
    expect(result.score_comparison.extracted >= result.score_comparison.criteria).toBe(
      true
    );
    expect(result.score_comparison.extracted).toBe(70);
    expect(result.score_comparison.criteria).toBe(70);
  });
});