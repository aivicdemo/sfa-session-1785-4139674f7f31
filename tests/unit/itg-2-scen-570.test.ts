import { judgeCorrectionRuleApproval } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-570
  test('修正ルール案が妥当性を満たさない場合、差し戻し決定が実行される', () => {
    const correctionRuleId = 'RULE-001';
    const correctionRuleName = '顧客名_正規化ルール_A';
    const applicableDataCount = 30;
    const minApplicableDataThreshold = 50;
    const aiValidityJudgment = 'NG';
    const aiRejectReason = '適用対象データ件数が基準の50件未満（実績：30件）';
    const currentRuleStandard = {
      minApplicableDataCount: 50,
      requiresEvidenceDocumentation: true,
      allowsContradictionWithPastCases: false,
    };

    const input = {
      correctionRuleId,
      correctionRuleName,
      applicableDataCount,
      aiValidityJudgment,
      aiRejectReason,
      currentRuleStandard,
    };

    const result = judgeCorrectionRuleApproval(input);

    expect(result.status).toBe('差し戻し');
    expect(result.approvalDecision).toBe('差し戻し決定');
    expect(result.rejectionReason).toBe(
      '適用対象データ件数が基準の50件未満（実績：30件）のため、妥当性を満たしません'
    );
    expect(result.isRemovedFromApprovalProcess).toBe(true);
    expect(result.holdsInReviewState).toBe(true);
  });
});