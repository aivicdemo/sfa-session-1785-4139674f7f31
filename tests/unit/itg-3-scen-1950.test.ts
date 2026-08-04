import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-1950
  test("過去商談データから抽出された成功パターンが0件のときに推奨が生成されない", async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn().mockResolvedValue(null),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(""),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const newDealData = {
      customerId: "CUST-2024-001",
      customerName: "ABC Corporation",
      industryType: "製造業",
      companySize: "中堅",
      dealTitle: "ERPシステム導入",
      dealAmount: 5000000,
      dealStage: "提案準備",
      dealConditions: {
        budgetConstraint: 5500000,
        implementationTimeline: "Q2 2024",
        requiredFeatures: ["会計", "在庫", "営業"],
      },
    };

    const fallbackPatterns = [
      {
        patternId: "PAT-001",
        description: "中堅製造業向けERP導入",
        successRate: 0.78,
        recommendationReason: "業種・規模別の平均的な成功パターン",
      },
      {
        patternId: "PAT-002",
        description: "IT導入支援型のコンサルティング",
        successRate: 0.65,
        recommendationReason: "業種別の統計的に上位の成功パターン",
      },
    ];

    const result = await generateRecommendation(newDealData, mockAIEngine);

    expect(result).toEqual({
      recommendationStatus: "no_direct_match",
      userMessage:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      recommendation: null,
      fallbackPatterns: fallbackPatterns,
      fallbackExplanation: "過去の成功事例から統計的に上位のパターンを提示しています",
      matchScore: 0,
      isUsingFallback: true,
    });

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});