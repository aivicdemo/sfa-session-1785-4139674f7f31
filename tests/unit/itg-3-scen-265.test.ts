import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・マッチング機能", () => {
  // SCEN-265
  test("新規案件の商談条件が入力されていないとき、推奨生成がスキップされる", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealData = {
      dealName: "ABC Corp 新規提案",
      customerName: "ABC Corporation",
      customerIndustry: "Manufacturing",
      customerSize: "Large",
      dealConditions: {
        customerChallenge: null,
        budget: null,
        decisionTimeline: null,
        keyDecisionMaker: null,
      },
    };

    const result = generateRecommendation(dealData, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(result.message).toBe(
      "推奨を生成するには商談条件を入力してください"
    );
    expect(result.recommendationGenerated).toBe(false);
  });
});