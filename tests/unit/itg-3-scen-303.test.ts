import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-303
  test("S3アップロード失敗時にHTML形式で画面表示され、ブラウザ保存で取得可能になる", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec-12345",
        proposalApproach: "顧客の経営課題に対応した段階的提案",
        confidenceScore: 85,
        successPatternRanks: [
          {
            rank: 1,
            patternName: "類似業種での成功事例",
            matchScore: 92,
            customerCount: 8,
          },
          {
            rank: 2,
            patternName: "同規模企業への導入実績",
            matchScore: 88,
            customerCount: 12,
          },
        ],
        reasoningBasis: "過去24件の成功商談から抽出した顧客属性と課題パターンに基づく",
        generatedAt: "2024-01-15T11:00:00Z",
      }),
    };

    let uploadAttemptCount = 0;
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockImplementation(() => {
        uploadAttemptCount++;
        if (uploadAttemptCount <= 2) {
          const error = new Error("S3 Upload failed");
          (error as any).statusCode = 403;
          return Promise.reject(error);
        }
        return Promise.resolve({ url: "https://s3.amazonaws.com/reports/rec-12345.pdf" });
      }),
    };

    const customerInfo = {
      customerId: "cust-98765",
      companyName: "テスト企業",
      industry: "IT",
      scale: "中堅企業",
      challenge: "デジタル変革の推進",
    };

    const dealInfo = {
      dealId: "deal-54321",
      productCategory: "クラウドソリューション",
      estimatedValue: 5000000,
      dealStage: "提案段階",
    };

    const result = await generateRecommendationReport(
      customerInfo,
      dealInfo,
      mockAIEngine,
      mockFileStorage
    );

    expect(result.s3UploadSuccess).toBe(false);
    expect(result.fallbackHtmlGenerated).toBe(true);
    expect(result.errorMessage).toMatch(/レポート生成に失敗しました/);
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toMatch(/テスト企業/);
    expect(result.htmlContent).toMatch(/顧客の経営課題に対応した段階的提案/);
    expect(result.htmlContent).toMatch(/85/);
    expect(result.htmlContent).toMatch(/類似業種での成功事例/);
    expect(result.htmlContent).toMatch(/92/);
    expect(result.htmlContent).toMatch(/過去24件の成功商談から抽出した顧客属性と課題パターンに基づく/);
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(2);
  });
});