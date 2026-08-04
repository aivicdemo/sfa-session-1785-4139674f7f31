import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2159
  test("推奨レポートのPDF/Excel生成 - ファイル形式が不正な値のとき、エラーが発生する", () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationData = {
      recommendationId: "rec-001",
      customerId: "cust-001",
      proposalApproach: "提案アプローチA",
      trustScore: 85,
      reasoning: [
        {
          factor: "過去事例との一致度",
          evidenceValue: 0.92,
        },
        {
          factor: "顧客属性マッチ度",
          evidenceValue: 0.88,
        },
      ],
    };

    const invalidFileFormats = [
      "CSV",
      "JSON",
      "",
      null,
      undefined,
      "txt",
      "doc",
      "<script>",
    ];

    invalidFileFormats.forEach((invalidFormat) => {
      mockFileStorageAdapter.uploadRecommendationReport.mockClear();

      const executeGeneration = () => {
        return generateRecommendationReport(
          recommendationData,
          invalidFormat as any,
          mockFileStorageAdapter
        );
      };

      const result = executeGeneration();

      expect(result).toHaveProperty("error");
      expect(result.error).toHaveProperty("type");
      expect(
        result.error.type === "BadRequestError" ||
          result.error.type === "ValidationError"
      ).toBe(true);

      expect(result.error.message).toMatch(/ファイル形式/);
      expect(result.error.message).toMatch(
        /PDF|Excel|サポート|しています/
      );

      expect(result.error.statusCode).toBeGreaterThanOrEqual(400);
      expect(result.error.statusCode).toBeLessThan(500);

      expect(result.userMessage).toBe(
        "レポート生成に失敗しました。ファイル形式を確認してください"
      );

      expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    });
  });
});