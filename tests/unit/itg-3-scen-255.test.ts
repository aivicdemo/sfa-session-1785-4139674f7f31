import { recordHistory } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨履歴の記録機能", () => {
  test("SCEN-255: 推奨対象の顧客IDが null のとき、推奨履歴の記録処理がエラーになる", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案アプローチA",
        confidenceScore: 85,
        reasoningBasis: "過去の成功パターンと合致",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const nullCustomerId = null;
    const dealCondition = {
      dealId: "DEAL-2024-001",
      customerIndustry: "製造業",
      customerScale: "大企業",
      proposalContent: "システム導入提案",
      dealAmount: 5000000,
    };

    expect(() => {
      recordHistory(nullCustomerId, dealCondition, mockAIEngine, mockFileStorage);
    }).toThrow(/顧客ID/);
  });
});