import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

const fetchMock = require("jest-fetch-mock");

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1852
  test("成功パターンマッチスコアが0未満のとき根拠情報の生成に失敗する", async () => {
    fetchMock.resetMocks();

    const new_deal_input = {
      customer_id: "C-001",
      customer_name: "テスト会社",
      industry: "製造業",
      company_size: "large",
      business_challenge: "生産効率化",
      deal_id: "D-001",
      deal_stage: "initial_contact",
      estimated_amount: 5000000,
      expected_close_date: "2024-12-31",
    };

    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(-0.5),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
    };

    const fallback_recommendation_master = [
      {
        pattern_id: "P-001",
        pattern_name: "標準提案パターンA",
        success_rate: 0.85,
        application_count: 150,
        brief_explanation: "顧客規模と業種に基づく標準パターン",
      },
      {
        pattern_id: "P-002",
        pattern_name: "標準提案パターンB",
        success_rate: 0.78,
        application_count: 120,
        brief_explanation: "同業種の過去事例に基づく提案",
      },
    ];

    const result = await visualizeRecommendationReasoning(
      new_deal_input,
      ai_engine_stub,
      fallback_recommendation_master
    );

    expect(ai_engine_stub.explainRecommendationReasoning).not.toHaveBeenCalled();

    expect(result.user_message).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );

    expect(result.recommended_pattern).toEqual({
      pattern_id: "P-001",
      pattern_name: "標準提案パターンA",
      success_rate: 0.85,
      application_count: 150,
    });

    expect(result.reasoning_brief).toBe("顧客規模と業種に基づく標準パターン");

    expect(result.is_fallback_mode).toBe(true);

    expect(result.retry_attempted).toBe(false);
  });
});