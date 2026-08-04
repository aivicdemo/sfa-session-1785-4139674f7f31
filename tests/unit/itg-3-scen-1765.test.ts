import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1765
  test("推奨内容が複数件のとき根拠表示内容に全要素を含めて返す", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendations: [
          {
            id: "rec_001",
            proposalApproach: "Solution A",
            patternId: "pattern_001",
            confidenceScore: 85,
          },
          {
            id: "rec_002",
            proposalApproach: "Solution B",
            patternId: "pattern_002",
            confidenceScore: 78,
          },
          {
            id: "rec_003",
            proposalApproach: "Solution C",
            patternId: "pattern_003",
            confidenceScore: 82,
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockImplementation(
        (recommendationId: string) => {
          const explanations: Record<string, string> = {
            rec_001:
              "顧客業界: 製造業 | 商談金額帯: 1000万円以上 | 購買決定者属性: 経営層 | 導入期間: 3ヶ月以内 | 類似成功事例: 同業A社での導入実績",
            rec_002:
              "顧客業界: 卸売業 | 商談金額帯: 500万円～1000万円 | 購買決定者属性: 部門長 | 導入期間: 6ヶ月以内 | 類似成功事例: 同業B社での拡大実績",
            rec_003:
              "顧客業界: 小売業 | 商談金額帯: 200万円～500万円 | 購買決定者属性: 課長級 | 導入期間: 2ヶ月以内 | 類似成功事例: 同業C社でのPOC実績",
          };
          return explanations[recommendationId] || "";
        }
      ),
    };

    const recommendations = [
      {
        id: "rec_001",
        proposalApproach: "Solution A",
        patternId: "pattern_001",
        confidenceScore: 85,
      },
      {
        id: "rec_002",
        proposalApproach: "Solution B",
        patternId: "pattern_002",
        confidenceScore: 78,
      },
      {
        id: "rec_003",
        proposalApproach: "Solution C",
        patternId: "pattern_003",
        confidenceScore: 82,
      },
    ];

    const result = explainRecommendationReasoning(
      recommendations,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.reasonings).toHaveLength(3);

    const reasoningIds = result.reasonings.map(
      (r: { recommendationId: string }) => r.recommendationId
    );
    expect(reasoningIds).toContain("rec_001");
    expect(reasoningIds).toContain("rec_002");
    expect(reasoningIds).toContain("rec_003");

    const rec001Reasoning = result.reasonings.find(
      (r: { recommendationId: string }) => r.recommendationId === "rec_001"
    );
    expect(rec001Reasoning.explanation).toContain("製造業");
    expect(rec001Reasoning.explanation).toContain("1000万円以上");
    expect(rec001Reasoning.explanation).toContain("経営層");
    expect(rec001Reasoning.explanation).toContain("3ヶ月以内");
    expect(rec001Reasoning.explanation).toContain("同業A社での導入実績");

    const rec002Reasoning = result.reasonings.find(
      (r: { recommendationId: string }) => r.recommendationId === "rec_002"
    );
    expect(rec002Reasoning.explanation).toContain("卸売業");
    expect(rec002Reasoning.explanation).toContain("500万円～1000万円");
    expect(rec002Reasoning.explanation).toContain("部門長");
    expect(rec002Reasoning.explanation).toContain("6ヶ月以内");
    expect(rec002Reasoning.explanation).toContain("同業B社での拡大実績");

    const rec003Reasoning = result.reasonings.find(
      (r: { recommendationId: string }) => r.recommendationId === "rec_003"
    );
    expect(rec003Reasoning.explanation).toContain("小売業");
    expect(rec003Reasoning.explanation).toContain("200万円～500万円");
    expect(rec003Reasoning.explanation).toContain("課長級");
    expect(rec003Reasoning.explanation).toContain("2ヶ月以内");
    expect(rec003Reasoning.explanation).toContain("同業C社でのPOC実績");

    expect(rec001Reasoning.explanation).not.toContain("卸売業");
    expect(rec001Reasoning.explanation).not.toContain("部門長");
    expect(rec002Reasoning.explanation).not.toContain("製造業");
    expect(rec002Reasoning.explanation).not.toContain("経営層");
    expect(rec003Reasoning.explanation).not.toContain("小売業");
    expect(rec003Reasoning.explanation).not.toContain("課長級");
  });
});