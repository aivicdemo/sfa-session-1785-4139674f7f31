import { generateRecommendationWithReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-850
  test("推奨根拠テーブルへのレコード挿入に失敗したとき、エラーで処理が進まない", () => {
    fetchMock.resetMocks();

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "初期接触フェーズでのニーズヒアリング",
        confidenceScore: 85,
        successPatternMatch: 0.82,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          caseId: "CASE-001",
          similarity: 0.88,
          outcome: "成約",
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        "過去の類似案件で初期接触フェーズでのニーズヒアリングが成功している"
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.82),
    };

    const mockDatabaseAdapter = {
      insertRecommendationReasoning: jest.fn().mockRejectedValue(
        new Error("DB_INSERT_FAILED: Failed to insert reasoning record")
      ),
      insertRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "REC-12345",
      }),
    };

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
    };

    const customerInfo = {
      customerId: "CUST-12345",
      industry: "IT",
      budget: 5000000,
    };

    const dealConditions = {
      proposalPhase: "initial_contact",
      competitionStatus: "present",
    };

    expect(() =>
      generateRecommendationWithReasoning(
        customerInfo,
        dealConditions,
        mockAIRecommendationEngine,
        mockDatabaseAdapter,
        mockLogger
      )
    ).toThrow(/DB_INSERT_FAILED/);

    expect(mockDatabaseAdapter.insertRecommendationReasoning).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(
        /Failed to insert reasoning record into recommendation_reasoning table/
      )
    );
  });
});