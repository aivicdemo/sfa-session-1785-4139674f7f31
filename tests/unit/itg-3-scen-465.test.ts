import { recommendGuidanceIntervention } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 指導施策推奨機能", () => {
  test("SCEN-465: スコアが低水準（21～40点）の場合、「重点指導」が推奨される", () => {
    // Arrange: スタブ定義
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedIntervention: "重点指導",
        reasoning:
          "スコア30点は低水準であり、低スコア案件への集中的な支援が必要です。",
        confidenceScore: 85,
        basePattern: "intensive_guidance_pattern",
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "intensive_guidance_pattern",
          frequency: 45,
          successRate: 0.78,
        },
      ]),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileUrl: "https://s3.example.com/report-123.pdf",
        uploadedAt: new Date("2024-01-15T11:00:00Z"),
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: "https://s3.example.com/download-token-abc",
        expiresAt: new Date("2024-01-15T12:00:00Z"),
      }),
    };

    const inputCaseData = {
      caseId: "case-465-001",
      currentScore: 30,
      businessUnit: "営業推進部",
      performer: "営業担当者A",
      caseType: "新規提案",
      createdAt: new Date("2024-01-15T10:00:00Z"),
    };

    // Act
    const result = recommendGuidanceIntervention(
      inputCaseData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert
    expect(result).toEqual({
      recommendedIntervention: "重点指導",
      reasoning:
        "スコア30点は低水準であり、低スコア案件への集中的な支援が必要です。",
      confidenceScore: 85,
      basePattern: "intensive_guidance_pattern",
      appliedPatternFrequency: 45,
      appliedPatternSuccessRate: 0.78,
      displayableMessage:
        "【推奨施策】重点指導が推奨されます。スコア30点は低水準であり、低スコア案件への集中的な支援が必要です。",
    });

    // Verify AI Engine was called correctly
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      {
        caseId: "case-465-001",
        currentScore: 30,
        businessUnit: "営業推進部",
        performer: "営業担当者A",
        caseType: "新規提案",
        createdAt: new Date("2024-01-15T10:00:00Z"),
      }
    );

    // Verify similar patterns were searched
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      {
        scoreRange: [21, 40],
        interventionType: "重点指導",
      }
    );
  });
});