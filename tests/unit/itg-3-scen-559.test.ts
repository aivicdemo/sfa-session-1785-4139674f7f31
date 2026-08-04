import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  test("SCEN-559: 新規案件の顧客条件が1個のとき該当する成功パターンが推奨される", async () => {
    // 前提条件: モック化したAIRecommendationEngine
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "SUCCESS_PATTERN_001",
          industry: "製造業",
          successRate: 0.78,
          pastCaseCount: 15,
          applicableConditions: ["industry"],
        },
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue({ relevanceScore: 0.82, rationale: "顧客業種が過去成功事例と一致" }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation:
          "顧客条件：業種が製造業の場合、過去成功率78%の実績があります。同業種での提案成功事例15件から抽出した営業アプローチをお勧めします。",
      }),
    };

    // 新規案件データの準備: 顧客条件が1個（業種：製造業）のみ
    const newDealData = {
      dealId: "DEAL_NEW_001",
      customerConditions: {
        industry: "製造業",
      },
      dealAmount: 5000000,
      dealStage: "初期商談",
    };

    // generateRecommendationを呼び出し
    const result = await generateRecommendation(newDealData, mockAIEngine);

    // 検証1: findSimilarPatternsが正しく呼び出されたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "製造業",
      })
    );

    // 検証2: 推奨内容に該当する成功パターン1件が含まれていることを確認
    expect(result.recommendedPatterns).toHaveLength(1);
    expect(result.recommendedPatterns[0].patternId).toBe("SUCCESS_PATTERN_001");
    expect(result.recommendedPatterns[0].industry).toBe("製造業");

    // 検証3: evaluatePatternRelevanceから返却されたスコアが0.75以上であることを確認
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.75);
    expect(result.relevanceScore).toBe(0.82);

    // 検証4: explainRecommendationReasoningで生成された根拠説明の内容を確認
    expect(result.explanation).toContain("顧客条件：業種が製造業");
    expect(result.explanation).toContain("過去成功率78%");
    expect(result.explanation).toContain("営業アプローチ");

    // 検証5: 推奨パターンが業種：製造業に紐づく過去成功事例であることを確認
    expect(result.recommendedPatterns[0].successRate).toBe(0.78);
    expect(result.recommendedPatterns[0].pastCaseCount).toBe(15);
  });
});