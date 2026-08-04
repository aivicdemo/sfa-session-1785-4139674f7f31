import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  // SCEN-1880
  test("新規案件の商談条件が空のとき照合に失敗する", async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        success: false,
        error: "deal_conditions_empty",
        fallbackPatterns: [
          {
            patternId: "FBK-001",
            matchScore: 0,
            recommendedApproach: "標準提案パターンA",
            successRate: 45,
          },
        ],
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: "過去の推奨履歴から類似案件を表示しています",
        isSimplified: true,
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: "CUST-2024-001",
      customerIndustry: "製造業",
      customerSize: "large",
      dealConditions: "",
      dealAmount: 5000000,
    };

    const result = await findSimilarPatterns(newDealData, mockAIEngine);

    expect(result.success).toBe(false);
    expect(result.error).toBe("deal_conditions_empty");
    expect(result.fallbackMessage).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.fallbackPatterns).toHaveLength(1);
    expect(result.fallbackPatterns[0].patternId).toBe("FBK-001");
    expect(result.fallbackPatterns[0].recommendedApproach).toBe(
      "標準提案パターンA"
    );
    expect(result.fallbackPatterns[0].successRate).toBe(45);
    expect(result.simplifiedExplanation).toBe(
      "過去の推奨履歴から類似案件を表示しています"
    );
    expect(result.isSimplifiedExplanation).toBe(true);
    expect(result.matchCompletedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
    );
  });
});