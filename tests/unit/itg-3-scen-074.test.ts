import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-074
  test("[normal] 推奨レポート生成機能 - レポート内容が1件の推奨を含む場合に正常に生成される", async () => {
    const case_id = "CASE-12345";
    const recommendation_data = {
      customer_industry: "製造業",
      budget_amount: 5000000,
      proposal_approach: "コスト削減重視",
    };

    const mock_ai_engine = {
      generateRecommendation: jest
        .fn()
        .mockResolvedValue([recommendation_data]),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue("推奨根拠の説明"),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.85),
    };

    const mock_file_storage = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue("s3://bucket/reports/report-20240801-001.pdf"),
      generateDownloadUrl: jest
        .fn()
        .mockResolvedValue(
          "https://s3.amazonaws.com/bucket/reports/report-20240801-001.pdf?expires=..."
        ),
      deleteExpiredReports: jest.fn().mockResolvedValue(true),
    };

    const generated_report = await generateRecommendationReport(
      case_id,
      [recommendation_data],
      mock_ai_engine,
      mock_file_storage
    );

    expect(generated_report.recommendationCount).toBe(1);
    expect(generated_report.title).toBe("案件ID: CASE-12345 推奨レポート");
    expect(generated_report.content).toContain("製造業");
    expect(generated_report.content).toContain("500万円");
    expect(generated_report.content).toContain("コスト削減重視");
    expect(mock_file_storage.uploadRecommendationReport).toHaveBeenCalledTimes(
      1
    );
    expect(generated_report.file_path).toBe(
      "s3://bucket/reports/report-20240801-001.pdf"
    );
  });
});