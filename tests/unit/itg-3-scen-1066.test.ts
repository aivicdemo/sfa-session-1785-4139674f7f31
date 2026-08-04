import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-1066
  test("OpenAI API呼び出し失敗時に根拠説明が簡略版で表示される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: "rec_20240115_001",
        customer_name: "テスト商社",
        transaction_amount: 5000000,
        industry: "製造業",
        recommended_approach: "導入効果の段階的提案",
        success_pattern_id: "pattern_mfg_001",
        confidence_score: 78,
        source: "fallback_pattern_master",
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          pattern_id: "pattern_mfg_001",
          customer_industry: "製造業",
          success_rate: 0.82,
          ranking: 1,
        },
      ]),
      explainRecommendationReasoning: jest
        .fn()
        .mockRejectedValue(new Error("API call timeout after 30000ms")),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevance_score: 78,
      }),
    };

    const newDealData = {
      customer_name: "テスト商社",
      transaction_amount: 5000000,
      industry: "製造業",
    };

    const result = await explainRecommendationReasoning(
      newDealData,
      mockAIEngine
    );

    expect(result.explanation_type).toBe("simplified");
    expect(result.explanation_text).toMatch(/導入効果の段階的提案/);
    expect(result.explanation_text.split("\n").length).toBeLessThanOrEqual(3);

    const full_version_word_count = 150;
    const actual_word_count = result.explanation_text.split(/\s+/).length;
    expect(actual_word_count).toBeLessThanOrEqual(
      Math.floor(full_version_word_count * 0.5)
    );

    expect(result.keywords_included).toBeDefined();
    expect(result.keywords_included.length).toBeGreaterThan(0);
    expect(result.keywords_included.length).toBeLessThanOrEqual(5);

    expect(result.user_message).not.toMatch(/一時的な遅延/);
    expect(result.recommendation_content).toBeDefined();
    expect(result.recommendation_content.customer_name).toBe("テスト商社");
    expect(result.recommendation_content.transaction_amount).toBe(5000000);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: "テスト商社",
        industry: "製造業",
      })
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    expect(result.fallback_applied).toBe(true);
    expect(result.pattern_source).toBe("internal_pattern_master");
    expect(result.success_rate_from_master).toBe(0.82);
  });
});