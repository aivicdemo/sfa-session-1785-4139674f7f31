import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-366
  test("推奨精度検証機能 - 成功パターンマッチスコアが null のとき、パターン関連性評価がエラーになる", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        matchScore: null,
        patterns: [],
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerIndustry: "IT",
      dealAmount: 5000000,
      proposalContent: "クラウド導入支援",
    };

    expect(() => evaluatePatternRelevance(input, mockAIEngine)).toThrow(
      /パターンマッチスコアがnull/
    );

    try {
      evaluatePatternRelevance(input, mockAIEngine);
    } catch (error) {
      expect(error).toHaveProperty("message");
      expect(error.message).toContain(
        "パターンマッチスコアがnullのため、パターン関連性評価を実行できません"
      );
      expect(error).toHaveProperty("code", "PATTERN_SCORE_NULL_ERROR");
      expect(error).toHaveProperty("statusCode", 400);
    }
  });
});