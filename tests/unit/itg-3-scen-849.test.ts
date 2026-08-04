import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-849
  test("成功パターンのマッチング結果が0件のとき、エラーオブジェクトを返却し、推奨パターンマスタから代替表示用の過去推奨を提供する", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealInput = {
      customerId: "CUST-20240115-001",
      customerIndustry: "manufacturing",
      customerScale: "large",
      dealAmount: 5000000,
      dealStage: "proposal",
      dealDescription: "ERP system implementation",
      dealTimeline: "Q2 2024",
    };

    const cachedPatternDatabase = [
      {
        patternId: "PAT-001",
        successRate: 0.85,
        customerIndustry: "manufacturing",
        customerScale: "large",
        recommendedApproach: "Phased implementation with executive alignment",
        confidence: 82,
      },
      {
        patternId: "PAT-002",
        successRate: 0.78,
        customerIndustry: "manufacturing",
        customerScale: "large",
        recommendedApproach: "Risk mitigation through pilot phase",
        confidence: 75,
      },
    ];

    const result = generateRecommendation(
      newDealInput,
      mockAIEngine,
      cachedPatternDatabase
    );

    expect(result).toEqual({
      success: false,
      errorCode: "NO_MATCHING_PATTERNS",
      errorMessage:
        "成功パターンマッチング結果が0件のため、推奨内容の算出ができません",
      userMessage:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      fallbackPatterns: cachedPatternDatabase,
      recommendationContent: null,
      confidenceScore: null,
      reasoningBasis: null,
    });

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealInput
    );
  });
});