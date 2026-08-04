import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  test("SCEN-1893: 新規案件の顧客条件と過去事例の顧客条件が矛盾するとき推奨生成に失敗する", async () => {
    const newDealData = {
      customerIndustry: "製造業",
      employeeCount: "500-1000名",
      budgetScale: "5000万円以上",
      implementationUrgency: "3ヶ月以内",
    };

    const pastSuccessPattern = {
      customerIndustry: "小売業",
      employeeCount: "50名以下",
      budgetScale: "500万円以下",
      implementationUrgency: "12ヶ月以上",
    };

    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue({ relevanceScore: 0.05 }),
      generateRecommendation: jest
        .fn()
        .mockRejectedValueOnce(
          new Error(
            "顧客条件の矛盾により推奨生成に失敗しました"
          )
        )
        .mockRejectedValueOnce(
          new Error(
            "顧客条件の矛盾により推奨生成に失敗しました"
          )
        )
        .mockRejectedValueOnce(
          new Error(
            "顧客条件の矛盾により推奨生成に失敗しました"
          )
        )
        .mockResolvedValueOnce({
          recommendedApproach: "キャッシュされた上位パターン",
          reasoningSummary: "簡略版根拠説明",
        }),
      findSimilarPatterns: jest.fn().mockResolvedValue([pastSuccessPattern]),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({ reportUrl: "https://s3.example.com/report.pdf" }),
      generateDownloadUrl: jest
        .fn()
        .mockResolvedValue({ downloadUrl: "https://s3.example.com/temp-url" }),
      deleteExpiredReports: jest.fn().mockResolvedValue({}),
    };

    const result = await generateRecommendation(
      newDealData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result).toEqual({
      recommendedApproach: "キャッシュされた上位パターン",
      reasoningSummary: "簡略版根拠説明",
      userMessage:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      fallbackMode: true,
      retryAttempts: 3,
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(
      4
    );
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalledWith(newDealData, pastSuccessPattern);
  });
});