import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と新規案件照合機能", () => {
  // SCEN-134
  test("過去商談から0件の成功パターンが抽出される場合、内部パターンマスタから統計上位パターンを返却し、簡略版根拠説明を生成する", async () => {
    const new_deal_condition = {
      customer_industry: "製造業",
      deal_size_jpy: 5000000,
      proposed_product: "クラウドERP"
    };

    const mock_find_similar_patterns = jest.fn().mockResolvedValue([]);

    const mock_explain_recommendation_reasoning = jest
      .fn()
      .mockResolvedValue({
        explanation:
          "統計的に上位のパターンに基づいて推奨されています。詳細は別途ご確認ください。"
      });

    const mock_ai_engine = {
      findSimilarPatterns: mock_find_similar_patterns,
      explainRecommendationReasoning: mock_explain_recommendation_reasoning,
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue({ relevance_score: 0 })
    };

    const mock_fallback_master_patterns = [
      {
        pattern_id: "p_001",
        industry: "製造業",
        deal_size_range_min_jpy: 3000000,
        deal_size_range_max_jpy: 7000000,
        product_category: "クラウドERP",
        success_count: 12,
        proposal_approach: "段階的導入型提案",
        recommended_action: "初期ヒアリング重視"
      }
    ];

    const fallback_pattern = mock_fallback_master_patterns[0];
    const simplified_explanation =
      "統計的に上位のパターンに基づいて推奨されています。詳細は別途ご確認ください。";

    const result = await generateRecommendation(
      new_deal_condition,
      mock_ai_engine,
      mock_fallback_master_patterns
    );

    expect(result.http_status_code).toBe(200);
    expect(result.is_recommendation_generated).toBe(false);
    expect(result.uses_fallback_pattern).toBe(true);
    expect(result.recommendation.source).toBe("fallback_master_pattern");
    expect(result.recommendation.proposal_approach).toBe(
      fallback_pattern.proposal_approach
    );
    expect(result.recommendation.recommended_action).toBe(
      fallback_pattern.recommended_action
    );
    expect(result.reasoning.explanation.length).toBeGreaterThanOrEqual(80);
    expect(result.reasoning.explanation.length).toBeLessThanOrEqual(150);
    expect(result.reasoning.explanation).toBe(simplified_explanation);
    expect(mock_find_similar_patterns).toHaveBeenCalledWith(new_deal_condition);
    expect(mock_explain_recommendation_reasoning).toHaveBeenCalled();
  });
});