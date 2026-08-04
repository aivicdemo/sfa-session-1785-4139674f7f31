import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-365
  test("推奨精度検証機能 - 計測精度値が100%を超えるときエラーになる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(() => 105),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const input = {
      aiEngine: mockAIEngine,
      fileStorage: mockFileStorage,
      recommendationId: "REC-2024-001",
      dealConditions: {
        customerId: "CUST-001",
        dealStage: "proposal",
        customerIndustry: "manufacturing",
      },
      historicalPatterns: [
        {
          patternId: "PAT-001",
          successRate: 0.85,
          applicableConditions: { industry: "manufacturing" },
        },
      ],
    };

    expect(() => evaluateRecommendationAccuracy(input)).toThrow(/計測精度値/);
  });
});