import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論実行前の学習データ・品質自動検証機能", () => {
  let mockDb: any;
  let mockAiClient: any;

  beforeEach(() => {
    mockDb = {
      learningData: Array.from({ length: 100 }, (_, i) => ({
        id: `TRAIN-${String(i + 1).padStart(3, "0")}`,
        salesPersonId: `SP-${String((i % 10) + 1).padStart(2, "0")}`,
        dealId: `DEAL-${String((i % 50) + 1).padStart(4, "0")}`,
        amount: 100000 + i * 1000,
        stage: ["初期接触", "提案", "交渉", "成約"][i % 4],
        createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
      })),
      qualityMetrics: {
        completenessScore: 95,
        duplicateRate: 2,
        anomalyRate: 1,
        timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
      },
    };

    mockAiClient = {
      validateLearningData: jest.fn(),
      validateDataQuality: jest.fn(),
      executeInference: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-123
  test("学習データが最小要件を満たし品質が良好な状態で、推論実行指示が1件のとき推論実行が許可される", async () => {
    // Arrange
    const { validateAndApproveInferenceExecution } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const requestId = "REQ-001";
    const modelVersion = "v2.1.0";
    const minRequiredTrainingRecords = 50;
    const minCompletenessScore = 90;
    const maxDuplicateRate = 5;
    const maxAnomalyRate = 5;

    const inferenceRequest = {
      requestId,
      modelVersion,
      timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
    };

    mockAiClient.validateLearningData.mockResolvedValue({
      recordCount: 100,
      hasRequiredAttributes: true,
      missingAttributeFields: [],
      isValid: true,
    });

    mockAiClient.validateDataQuality.mockResolvedValue({
      completenessScore: 95,
      duplicateRate: 2,
      anomalyRate: 1,
      timestamp: new Date("2024-01-15T11:00:00Z").toISOString(),
      meetsThreshold: true,
    });

    mockAiClient.executeInference.mockResolvedValue({
      inferenceId: "INF-2024-001",
      status: "APPROVED",
      approvedAt: new Date("2024-01-15T11:00:05Z").toISOString(),
    });

    // Act
    const result = await validateAndApproveInferenceExecution(
      inferenceRequest,
      {
        trainingDataRecords: mockDb.learningData,
        qualityMetrics: mockDb.qualityMetrics,
      },
      {
        minRequiredTrainingRecords,
        minCompletenessScore,
        maxDuplicateRate,
        maxAnomalyRate,
      },
      mockAiClient
    );

    // Assert
    expect(result.status).toBe("APPROVED");
    expect(result.inferenceId).toBeDefined();
    expect(result.inferenceId).toMatch(/^INF-/);
    expect(result.requestId).toBe(requestId);
    expect(result.modelVersion).toBe(modelVersion);

    expect(mockAiClient.validateLearningData).toHaveBeenCalledWith(
      mockDb.learningData,
      minRequiredTrainingRecords
    );

    expect(mockAiClient.validateDataQuality).toHaveBeenCalledWith(
      mockDb.qualityMetrics,
      {
        minCompletenessScore,
        maxDuplicateRate,
        maxAnomalyRate,
      }
    );

    expect(mockAiClient.executeInference).toHaveBeenCalledWith(
      inferenceRequest,
      mockDb.learningData
    );

    expect(result.validationLog).toBeDefined();
    expect(result.validationLog.learningDataValidation.isValid).toBe(true);
    expect(result.validationLog.learningDataValidation.recordCount).toBe(100);
    expect(result.validationLog.qualityValidation.meetsThreshold).toBe(true);
    expect(result.validationLog.qualityValidation.completenessScore).toBe(95);
    expect(result.validationLog.qualityValidation.duplicateRate).toBe(2);
    expect(result.validationLog.qualityValidation.anomalyRate).toBe(1);
  });
});