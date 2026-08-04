import { validateInferenceAccuracy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-402: [edge] 推論精度検証機能 - 精度計測結果の小数点以下が発生する（例：77.5%）とき、指定桁数で四捨五入して記録
  test("推論精度検証で小数点以下を含むスコアを指定桁数で四捨五入して記録", () => {
    const rawScore = 0.775;
    const precisionDigits = 1;

    const stubAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(rawScore),
    };

    const stubFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileId: "report-001",
        fileName: "inference_accuracy_report.pdf",
        uploadedAt: "2024-01-15T11:00:00Z",
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const result = validateInferenceAccuracy(
      {
        precision: precisionDigits,
      },
      stubAIEngine,
      stubFileStorage
    );

    const expectedRoundedValue = 0.778;

    expect(result.roundedAccuracy).toBe(expectedRoundedValue);
    expect(result.recordedInPatternMaster).toBe(expectedRoundedValue);
    expect(result.recordedInReportMetadata).toBe(expectedRoundedValue);
    expect(result.accuracyPercentage).toBe("77.8%");
    expect(stubAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(stubFileStorage.uploadRecommendationReport).toHaveBeenCalled();
  });
});