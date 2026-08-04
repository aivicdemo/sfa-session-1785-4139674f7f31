import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { generateAndSaveReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-989
  test("出力形式が不正値のとき、レポート生成処理が開始されず警告が返される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const invalidFormats = [
      "invalid_format",
      "",
      null,
      undefined,
      123,
      "WORD",
      "jpg",
    ];

    invalidFormats.forEach((invalidFormat) => {
      mockAIRecommendationEngine.generateRecommendation.mockClear();
      mockFileStorageAdapter.uploadRecommendationReport.mockClear();

      const reportRequest = {
        customerId: "CUST-001",
        dealId: "DEAL-2024-001",
        recommendationContent: {
          approach: "提案アプローチA",
          reasoning: "成功パターンマッチング結果",
        },
        outputFormat: invalidFormat,
        reportMetadata: {
          generatedAt: "2024-01-15T11:00:00Z",
          generatedBy: "sales_user_001",
        },
      };

      const result = generateAndSaveReport(
        reportRequest,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      );

      expect(result).toEqual({
        errorCode: "INVALID_OUTPUT_FORMAT",
        errorMessage: "出力形式が無効です。対応形式はPDF、Excelです",
      });

      expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
      expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    });
  });
});