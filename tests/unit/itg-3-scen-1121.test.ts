import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1121: 成功パターン適用可能性スコアが 1 を超過したとき、根拠可視化処理がエラーになる", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC-001",
        proposalApproach: "顧客の経営効率化支援",
        patternRelevanceScore: 1.5,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "PAT-001",
          customerId: "TEST-CUST-001",
          successRate: 0.85,
        },
      ]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue({
          reasoning: "過去の類似案件では成功している提案アプローチです。",
        }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 1.5,
        isApplicable: false,
      }),
    };

    const inputData = {
      customerId: "TEST-CUST-001",
      dealAmount: 5000000,
      industry: "製造業",
      recommendationId: "REC-001",
    };

    const result = explainRecommendationReasoning(
      inputData,
      mockAIRecommendationEngine
    );

    expect(result).toEqual(
      expect.objectContaining({
        errorCode: "PATTERN_RELEVANCE_EXCEEDED",
        errorMessage:
          "適用可能性スコア(1.5)が上限値(1.0)を超過しており、根拠の可視化処理を実行できません",
        reasoning: undefined,
      })
    );
  });
});