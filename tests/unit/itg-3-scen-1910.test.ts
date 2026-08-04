import { generateRecommendationExplanation } from "../../src/logic/it-1-br-3-1-1-1";

describe("推奨根拠の可視化機能", () => {
  test("SCEN-1910: 過去事例の日付が期間開始日ちょうどのときに根拠に含まれる", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          case_id: "CASE-001",
          case_date: "2024-01-15",
          customer_industry: "製造業",
          success_pattern: "提案アプローチA",
          similarity_score: 0.92,
        },
      ]),
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation_id: "REC-2024-001",
        recommendation_content: "提案アプローチAを採用することを推奨",
        confidence_score: 85,
        supporting_cases: ["CASE-001"],
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          "2024年1月15日の製造業顧客との成功事例に基づいて、提案アプローチAが最適と判断されました。この事例では同様の顧客属性と商談条件で92%の類似度が確認されています。"
        ),
    };

    const newBusinessRequest = {
      customer_industry: "製造業",
      search_period_start: "2024-01-15",
      search_period_end: "2024-12-31",
      company_size: "large",
      business_issue: "生産効率化",
    };

    const result = generateRecommendationExplanation(
      newBusinessRequest,
      mockAIEngine
    );

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith({
      industry: "製造業",
      period_start: "2024-01-15",
      period_end: "2024-12-31",
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();

    expect(result.supporting_cases).toContain("CASE-001");

    expect(result.supporting_cases_detail).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          case_id: "CASE-001",
          case_date: "2024-01-15",
          customer_industry: "製造業",
        }),
      ])
    );

    expect(result.explanation_text).toMatch(/2024年1月15日/);
    expect(result.explanation_text).toMatch(/製造業顧客/);
    expect(result.explanation_text).toMatch(/成功事例/);
    expect(result.explanation_text).toMatch(/提案アプローチA/);

    expect(result.confidence_score).toBe(85);
  });
});