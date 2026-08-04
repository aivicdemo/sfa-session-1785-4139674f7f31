import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2237: 推奨根拠が推奨内容と紐付けて表示される", () => {
    const recommendation_id = "REC-001";
    const expected_reasoning_text =
      "過去3年間の類似案件15件中、本提案アプローチで成約率87%を達成";
    const expected_pattern_match_score = 0.92;

    const mock_ai_engine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: recommendation_id,
        proposalContent:
          "顧客Aの予算規模に基づき、エンタープライズプラン+カスタマイズサービスを提案",
        reasoning: `pattern-match-score: ${expected_pattern_match_score}`,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: recommendation_id,
        explanation: expected_reasoning_text,
      }),
    };

    const mock_dom_builder = {
      createRecommendationElement: jest.fn().mockReturnValue({
        dataset: { recommendationId: recommendation_id },
        innerHTML: "顧客Aの予算規模に基づき、エンタープライズプラン+カスタマイズサービスを提案",
      }),
      createReasoningElement: jest.fn().mockReturnValue({
        className: `recommendation-reasoning-${recommendation_id}`,
        textContent: expected_reasoning_text,
      }),
    };

    const result = explainRecommendationReasoning(
      recommendation_id,
      mock_ai_engine,
      mock_dom_builder
    );

    expect(result).toBeDefined();
    expect(result.recommendationId).toBe(recommendation_id);
    expect(result.explanation).toBe(expected_reasoning_text);
    expect(result.reasoning_score).toBe(expected_pattern_match_score);

    expect(mock_ai_engine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendation_id
    );
    expect(mock_dom_builder.createReasoningElement).toHaveBeenCalledWith(
      expected_reasoning_text,
      recommendation_id
    );

    const reasoning_element = mock_dom_builder.createReasoningElement(
      expected_reasoning_text,
      recommendation_id
    );
    expect(reasoning_element.className).toContain(
      `recommendation-reasoning-${recommendation_id}`
    );
    expect(reasoning_element.textContent).toBe(expected_reasoning_text);
  });
});