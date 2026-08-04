import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  let mockFileStorageAdapter: any;
  let mockAIRecommendationEngine: any;

  beforeEach(() => {
    mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-20240115-001",
        recommendedApproach: "提案アプローチA",
        trustScore: 85,
        reasoningBasis: {
          pastCasesMatched: 12,
          successRate: 78.5,
          customerProfile: {
            industry: "IT",
            employeeCount: 500,
          },
          matchedPatterns: ["パターンX", "パターンY"],
        },
        generatedAt: "2024-01-15T11:00:00Z",
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1704
  test("レポート生成リクエストに不正なファイル形式パラメータが指定された場合、エラーが発生してアップロード処理が実行されない", async () => {
    const invalidFormats = ["invalid", "", null, undefined, ".xyz", ".bin"];

    for (const invalidFormat of invalidFormats) {
      mockFileStorageAdapter.uploadRecommendationReport.mockClear();

      const recommendationData = {
        customerId: "cust-001",
        dealId: "deal-20240115-001",
        proposalContent: "提案内容の詳細",
      };

      let thrownError: any = null;

      try {
        await generateRecommendationReport(
          recommendationData,
          invalidFormat as any,
          mockAIRecommendationEngine,
          mockFileStorageAdapter
        );
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).toBeDefined();
      expect(thrownError).toBeInstanceOf(Error);
      expect(thrownError.message).toMatch(/サポートされていないファイル形式です|不正なファイル形式が指定されました/);
      expect(thrownError.code).toBe("INVALID_FILE_FORMAT");
      expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    }
  });
});