import { evaluateInferenceAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-406
  test("[edge] 推論精度検証機能 - 精度検証実行後、改善提案が1件生成されるとき、その提案を検証結果に付与", () => {
    fetchMock.resetMocks();

    const mockEngineEvaluateRelevance = jest.fn();
    mockEngineEvaluateRelevance.mockResolvedValue({
      relevanceScore: 0.75,
      isApplicable: true,
    });

    const testDealData = {
      dealId: "deal-uuid-001",
      customerIndustry: "manufacturing",
      customerSize: "large",
      productCategory: "software_solution",
      dealStage: "proposal",
      pastSuccessPatterns: [
        {
          patternId: "pattern-001",
          matchScore: 0.85,
          successRate: 0.92,
        },
      ],
    };

    const verificationResult = {
      verificationId: "verify-uuid-001",
      accuracyScore: 0.75,
      verificationStatus: "completed",
      timestamp: "2024-01-15T10:30:00Z",
      improvementSuggestions: [],
    };

    const generatedSuggestion = {
      proposalId: "suggest-uuid-001",
      description: "顧客規模が大きい場合、提案アプローチをより詳細に展開することで適用性が向上します",
      priorityScore: 0.8,
      timestamp: "2024-01-15T10:35:00Z",
    };

    const inputParams = {
      dealData: testDealData,
      inferenceEngine: { evaluatePatternRelevance: mockEngineEvaluateRelevance },
      currentVerificationResult: verificationResult,
    };

    const result = evaluateInferenceAccuracy(inputParams);

    expect(result.improvementSuggestions).toHaveLength(1);
    expect(result.improvementSuggestions[0].proposalId).toMatch(/^suggest-uuid-\d+$/);
    expect(result.improvementSuggestions[0].description).toBeTruthy();
    expect(typeof result.improvementSuggestions[0].description).toBe("string");
    expect(result.improvementSuggestions[0].description.length).toBeGreaterThan(0);
    expect(result.improvementSuggestions[0].priorityScore).toBeGreaterThanOrEqual(0.0);
    expect(result.improvementSuggestions[0].priorityScore).toBeLessThanOrEqual(1.0);
    expect(result.improvementSuggestions[0].timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );

    expect(result.accuracyScore).toBe(0.75);
    expect(result.verificationStatus).toBe("completed");
    expect(result.timestamp).toBe("2024-01-15T10:30:00Z");
  });
});