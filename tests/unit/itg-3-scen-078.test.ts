import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-078
  test("推奨レポート生成機能 - Amazon S3アップロードが失敗した場合にHTML形式で画面表示される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "顧客の成長段階に応じたスケーラブルな提案",
        confidenceScore: 87,
        reasoning: "過去3件の類似案件で80%以上の成約率を記録",
        similarPatterns: [
          {
            caseId: "CASE-2024-001",
            matchScore: 92,
            outcome: "成約",
            approach: "段階的導入アプローチ",
          },
          {
            caseId: "CASE-2024-002",
            matchScore: 85,
            outcome: "成約",
            approach: "コスト最適化提案",
          },
        ],
      }),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest
        .fn()
        .mockRejectedValueOnce(
          new Error("403 Forbidden: Access denied to S3 bucket"),
        )
        .mockRejectedValueOnce(
          new Error("Connection timeout: S3 service unavailable"),
        )
        .mockRejectedValueOnce(
          new Error("403 Forbidden: Invalid credentials"),
        ),
    };

    const dealCondition = {
      customerId: "CUST-2024-045",
      customerName: "株式会社テック・イノベーション",
      industry: "情報技術",
      companySize: "中堅企業",
      budget: 5000000,
      dealStage: "提案準備",
      productCategory: "業務システム",
      targetOutcome: "業務効率化",
    };

    const result = await generateRecommendationReport(
      dealCondition,
      mockAIEngine,
      mockFileStorage,
    );

    expect(result.status).toBe("fallback_html");
    expect(result.errorMessage).toMatch(/レポート生成に失敗しました/);
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toContain("<!DOCTYPE html>");
    expect(result.htmlContent).toContain("</html>");
    expect(result.htmlContent).toContain(
      "顧客の成長段階に応じたスケーラブルな提案",
    );
    expect(result.htmlContent).toContain("87");
    expect(result.htmlContent).toContain(
      "過去3件の類似案件で80%以上の成約率を記録",
    );
    expect(result.htmlContent).toContain("CASE-2024-001");
    expect(result.htmlContent).toContain("92");
    expect(result.htmlContent).toContain("成約");
    expect(result.htmlContent).toContain("段階的導入アプローチ");
    expect(result.htmlContent).toContain("CASE-2024-002");
    expect(result.htmlContent).toContain("85");
    expect(result.htmlContent).toContain("コスト最適化提案");

    const htmlStructureRegex = /<html[\s>][\s\S]*<head[\s>][\s\S]*<body[\s>]/;
    expect(result.htmlContent).toMatch(htmlStructureRegex);

    const closingTagsRegex = /<\/body[\s>][\s\S]*<\/html[\s>]/;
    expect(result.htmlContent).toMatch(closingTagsRegex);

    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(
      3,
    );
  });
});