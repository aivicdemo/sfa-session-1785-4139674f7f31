import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  // SCEN-1892
  test("照合ルールが0件のとき照合に失敗する", async () => {
    const newDealCondition = {
      industry: "IT",
      budget: 5000000,
      decisionMaker: "CTO"
    };

    const matchingRulesStub = {
      getActiveRules: jest.fn().mockResolvedValue([])
    };

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const result = await findSimilarPatterns(
      newDealCondition,
      matchingRulesStub,
      aiEngineStub
    );

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(result.error?.code).toBe("MATCHING_RULES_NOT_FOUND");
    expect(result.error?.message).toBe(
      "適用可能な照合ルールが存在しません"
    );
    expect(result.error?.status).toBe(422);

    expect(aiEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(aiEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiEngineStub.generateRecommendation).not.toHaveBeenCalled();
  });
});