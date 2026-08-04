import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { generateReport } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1380
  test("推奨内容データが空のときレポート生成がエラーになる", () => {
    const emptyRecommendationData = {
      recommendationContent: [],
      reasoning: null,
      dealId: "DEAL-12345",
      customerId: "CUST-67890",
      timestamp: new Date("2024-01-15T11:00:00Z"),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(emptyRecommendationData),
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
      generateReport(emptyRecommendationData, mockAIEngine, mockFileStorage)
    ).toThrow(/推奨内容/);

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});