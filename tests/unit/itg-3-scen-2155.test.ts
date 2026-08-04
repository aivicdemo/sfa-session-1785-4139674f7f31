import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2155
  test("推奨内容が null のとき、エラーが発生する", () => {
    const customerId = "CUST-001";
    const dealConditions = {
      industry: "製造業",
      scale: "中堅企業",
      budget: 5000000,
      timeline: "3ヶ月以内",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue(null),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() =>
      generateRecommendationReport(
        customerId,
        dealConditions,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/推奨内容/);

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});