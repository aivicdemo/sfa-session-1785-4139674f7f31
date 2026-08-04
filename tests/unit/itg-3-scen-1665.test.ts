import { evaluateRecommendationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨支援システム - 推奨根拠の可視化", () => {
  // SCEN-1665
  test("推奨スコア算出機能 - 類似パターン検索が0件返却されたときエラーが発生する", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputDealCondition = {
      customerId: "CUST-20240115-001",
      industryType: "manufacturing",
      companySize: "large",
      dealStage: "negotiation",
      budgetRange: 5000000,
      dealValue: 3000000,
      timelineMonths: 3,
    };

    expect(async () => {
      await evaluateRecommendationScore(inputDealCondition, mockAIEngine);
    }).rejects.toThrow(/類似する過去成功事例/);
  });
});