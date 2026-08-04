import { evaluateProposalCustomerFitScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1392
  test("提案内容と顧客制約条件の自動照合機能 - 顧客の経営目標が提案内容と完全一致するとき、適合度スコアが最大値となる", () => {
    const customerData = {
      managementGoals: "デジタル変革による業務効率化と顧客満足度向上",
    };

    const proposalContent = {
      proposalContent:
        "デジタル変革による業務効率化と顧客満足度向上を実現するAI導入ソリューション",
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.0),
    };

    const fitScore = evaluateProposalCustomerFitScore(
      customerData,
      proposalContent,
      mockAIRecommendationEngine
    );

    expect(fitScore).toBe(1.0);
    expect(typeof fitScore).toBe("number");
    expect(fitScore).toBeGreaterThanOrEqual(0);
    expect(fitScore).toBeLessThanOrEqual(1);
  });
});