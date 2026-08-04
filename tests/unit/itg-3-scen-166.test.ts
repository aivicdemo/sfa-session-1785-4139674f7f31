import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { generateRecommendationWithReportAndFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能 - レポート生成・アップロード", () => {
  test("SCEN-166: S3アップロード失敗時にHTML形式での画面表示が実行される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    let uploadAttemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadAttemptCount++;
        const error = new Error("S3 upload failed: Network timeout");
        (error as any).code = "NetworkError";
        throw error;
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    mockAIEngine.generateRecommendation.mockResolvedValue({
      approachId: "APP-001",
      recommendedApproach: "顧客ニーズ診断から段階的提案へ移行",
      confidenceScore: 87,
      reasoning: "過去の同業種・同規模顧客との成功パターンに合致",
      successFactors: [
        "初期接触時の業界課題の深掘りヒアリング",
        "ROI試算に基づいた段階導入計画の提示",
      ],
      riskFactors: ["導入スケジュール調整の柔軟性確保"],
      estimatedSuccessProbability: 0.87,
    });

    const targetCaseData = {
      customerId: "CUST-20240115-001",
      customerName: "日本製造業A社",
      customerIndustry: "製造業",
      customerScale: "従業員1500名",
      dealValue: 5000000,
      dealStatus: "提案準備段階",
      customerChallenges: [
        "生産効率化",
        "デジタル化推進",
      ],
      salesRepId: "REP-0847",
      dealCreatedAt: "2024-01-15T09:30:00Z",
    };

    let result: any;
    try {
      result = await generateRecommendationWithReportAndFallback(
        targetCaseData,
        mockAIEngine,
        mockFileStorageAdapter
      );
    } catch (error) {
      result = (error as any).fallbackDisplay;
    }

    expect(uploadAttemptCount).toBe(3);

    expect(result).toBeDefined();
    expect(result).toContain(
      "レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください"
    );

    expect(result).toContain("顧客ニーズ診断から段階的提案へ移行");
    expect(result).toContain("過去の同業種・同規模顧客との成功パターンに合致");
    expect(result).toContain("87");
    expect(result).toContain("<table");
    expect(result).toContain("</table>");
    expect(result).toContain("<tr");
    expect(result).toContain("</tr>");

    expect(result).toContain("ブラウザの保存機能で取得可能");

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
  });
});