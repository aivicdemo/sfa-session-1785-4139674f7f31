import { evaluateCorrectionRuleApproval } from "../../src/logic/it-1-br-2-2-1-1";

describe("修正ルール承認判定機能", () => {
  // SCEN-578
  test("妥当性スコアが基準値直下である場合、差し戻し判定が実行される", () => {
    const correctionRuleProposal = {
      ruleId: "RULE-001",
      ruleName: "顧客データ重複排除ルール",
      description: "同一企業コードの重複レコードを統合",
      validityScore: 69,
      pastCaseCount: 5,
      pastApprovalRate: 0.55,
      similaritySimilarity: 0.82,
    };

    const evaluationCriteria = {
      passingScoreThreshold: 70,
      rejectionScoreThreshold: 69,
    };

    const approvalResult = evaluateCorrectionRuleApproval(
      correctionRuleProposal,
      evaluationCriteria
    );

    expect(approvalResult.approvalStatus).toBe("差し戻し");
    expect(approvalResult.rationale).toMatch(/妥当性スコア69点が基準値70点未満のため差し戻し対象/);
    expect(approvalResult.recommendedAction).toMatch(/ルール案の見直しおよび再提出を要望します/);
  });
});