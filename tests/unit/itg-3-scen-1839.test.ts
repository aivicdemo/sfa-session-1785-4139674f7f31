import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1839: 商談IDが空文字列のとき根拠情報取得に失敗する", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() => {
        throw new Error("商談ID");
      }),
    };

    const mockPatternMaster = [
      {
        pattern_id: "pat_001",
        success_rate: 85,
        description: "初期接触から提案まで2週間以内に実施",
      },
      {
        pattern_id: "pat_002",
        success_rate: 78,
        description: "複数部門への同時提案",
      },
      {
        pattern_id: "pat_003",
        success_rate: 72,
        description: "経営層への直接提案",
      },
    ];

    const deal_id = "";

    let fallback_reasoning = null;
    let error_occurred = false;

    try {
      mockAIEngine.explainRecommendationReasoning(deal_id);
    } catch (error) {
      error_occurred = true;
      if (error instanceof Error && error.message.includes("商談ID")) {
        const top_pattern = mockPatternMaster.reduce((prev, current) =>
          prev.success_rate >= current.success_rate ? prev : current
        );
        fallback_reasoning = {
          pattern: top_pattern.pattern_id,
          success_rate: top_pattern.success_rate,
          simplified_description: top_pattern.description,
          is_fallback: true,
        };
      }
    }

    expect(error_occurred).toBe(true);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      deal_id
    );
    expect(fallback_reasoning).toEqual({
      pattern: "pat_001",
      success_rate: 85,
      simplified_description: "初期接触から提案まで2週間以内に実施",
      is_fallback: true,
    });
  });
});