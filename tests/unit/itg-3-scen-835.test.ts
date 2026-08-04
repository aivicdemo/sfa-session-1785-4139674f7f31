import { evaluateRecommendationCredibility } from "../../src/logic/it-1-br-3-1-1-1";

const mockAIRecommendationEngine = {
  evaluatePatternRelevance: jest.fn(),
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
};

describe("推奨内容の信頼度スコア算出・根拠提示機能", () => {
  test("SCEN-835: 信頼度スコアが0未満の場合、エラーで処理が中断される", () => {
    const newDealCondition = {
      customerId: "CUST-001",
      customerIndustry: "製造業",
      customerScale: "大企業",
      dealAmount: 5000000,
      dealStage: "提案段階",
    };

    const negativeScoreResponse = {
      credibilityScore: -0.5,
      applicablePatternId: "PATTERN-123",
      patternDescription: "大企業製造業向け標準提案",
    };

    mockAIRecommendationEngine.evaluatePatternRelevance.mockReturnValue(
      negativeScoreResponse
    );

    expect(() => {
      evaluateRecommendationCredibility(newDealCondition, mockAIRecommendationEngine);
    }).toThrow(/信頼度スコアが無効です/);

    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith(newDealCondition);
    expect(
      mockAIRecommendationEngine.explainRecommendationReasoning
    ).not.toHaveBeenCalled();
  });
});