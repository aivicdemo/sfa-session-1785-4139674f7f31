import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-335
  test("[normal] 推奨精度検証機能 - 推奨根拠が空の商談について、精度計測が正常に進行する", async () => {
    const dealId = "DEAL-20240115-001";
    const customerId = "CUST-12345";
    const dealCondition = {
      industry: "IT",
      companySize: "large",
      budget: 5000000,
      timeline: "Q2",
    };

    const dealData = {
      dealId,
      customerId,
      dealCondition,
      recommendationReason: "",
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: {
          approach: "提案アプローチ案",
          reasoning: "",
          confidence: 0.0,
        },
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.0),
    };

    const mockReportStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: "report-20240115-001",
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue(
        "https://s3.example.com/report-20240115-001"
      ),
      deleteExpiredReports: jest.fn().mockResolvedValue(true),
    };

    const mockMetadataRecorder = {
      recordAccuracyEvaluation: jest.fn().mockResolvedValue({
        id: "meta-20240115-001",
        dealId,
        timestamp: "2024-01-15T11:00:00Z",
      }),
    };

    const result = await evaluateRecommendationAccuracy(
      dealData,
      mockAIEngine,
      mockReportStorage,
      mockMetadataRecorder
    );

    expect(result).toBeDefined();
    expect(result.dealId).toBe(dealId);
    expect(typeof result.accuracyScore).toBe("number");
    expect(result.accuracyScore).toBeGreaterThanOrEqual(0);
    expect(result.accuracyScore).toBeLessThanOrEqual(1);
    expect(result.evaluationStatus).toMatch(/completed|success/);
    expect(result.processingTimestamp).toBeDefined();
    expect(mockMetadataRecorder.recordAccuracyEvaluation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId,
        accuracyScore: result.accuracyScore,
        evaluationStatus: result.evaluationStatus,
      })
    );
  });
});