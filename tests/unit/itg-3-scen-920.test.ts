import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-920
  test("推奨根拠説明生成機能 - 根拠説明の説明テキストが1文字のとき正しく生成される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        reasoning_text: "◎",
        confidence_score: 85,
        supporting_data: ["past_success_case_1"],
      }),
    };

    const recommendation_id = "REC-001";
    const customer_id = "CUST-001";
    const recommendation_content = "提案アプローチA";
    const success_pattern_id = "PAT-001";

    const result = explainRecommendationReasoning(
      recommendation_id,
      customer_id,
      recommendation_content,
      success_pattern_id,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.reasoning_text).toBe("◎");
    expect(result.reasoning_text.length).toBe(1);
    expect(typeof result.reasoning_text).toBe("string");
    expect(result.confidence_score).toBe(85);
    expect(Array.isArray(result.supporting_data)).toBe(true);
    expect(result.supporting_data.length).toBeGreaterThan(0);

    const htmlRendered = `<p>${result.reasoning_text}</p>`;
    expect(htmlRendered).toBe("<p>◎</p>");

    const jsonRendered = JSON.stringify(result);
    expect(jsonRendered).toContain("◎");
    expect(jsonRendered).not.toContain("\\u◎");

    mockAIEngine.explainRecommendationReasoning.mockClear();
  });
});