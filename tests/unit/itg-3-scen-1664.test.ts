import {
  calculateRecommendationScore,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1664
  test("推奨スコア算出機能 - AIエージェントがタイムアウト (30秒超過) したとき、代替処理が実行される", async () => {
    const timeoutError = new Error("Timeout after 30000ms");
    timeoutError.name = "TimeoutError";

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(timeoutError), 100);
          })
      ),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMasterStore = {
      getTopPatterns: jest.fn().mockReturnValue([
        {
          pattern_id: "pat_001",
          customer_segment: "medium_enterprise",
          success_rate: 78.5,
          pattern_name: "Medium SaaS Solution",
          description: "Established approach for mid-market SaaS adoption",
        },
        {
          pattern_id: "pat_002",
          customer_segment: "medium_enterprise",
          success_rate: 71.2,
          pattern_name: "Phased Implementation",
          description: "Step-by-step deployment strategy",
        },
      ]),
    };

    const newDealInput = {
      customer_id: "cust_20240515_001",
      customer_name: "新規テスト顧客",
      industry: "software",
      company_size: "medium_enterprise",
      purchase_budget_usd: 150000,
      decision_timeline_days: 45,
      key_stakeholders: ["CTO", "CFO"],
      current_initiatives: ["digital_transformation"],
      deal_size_usd: 120000,
      deal_stage: "discovery",
      proposed_solution_category: "saas_platform",
    };

    const expectedRecommendationResult = {
      recommendation_id: expect.any(String),
      status: "fallback_success",
      recommended_patterns: [
        {
          pattern_id: "pat_001",
          pattern_name: "Medium SaaS Solution",
          confidence_score: 78.5,
          applicability: "high",
        },
        {
          pattern_id: "pat_002",
          pattern_name: "Phased Implementation",
          confidence_score: 71.2,
          applicability: "medium",
        },
      ],
      message:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      reasoning_summary:
        "内部パターンマスタから統計的に上位の成功パターンを取得しました。詳細な分析は後ほど再試行します。",
      is_fallback: true,
      fallback_reason: "External AI service timeout exceeded 30000ms",
      generated_at: expect.any(String),
    };

    const result = await calculateRecommendationScore(
      newDealInput,
      mockAIRecommendationEngine,
      mockPatternMasterStore
    );

    expect(result.status).toBe("fallback_success");
    expect(result.is_fallback).toBe(true);
    expect(result.message).toBe(
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します"
    );
    expect(result.recommended_patterns.length).toBe(2);
    expect(result.recommended_patterns[0].pattern_id).toBe("pat_001");
    expect(result.recommended_patterns[0].confidence_score).toBe(78.5);
    expect(result.recommended_patterns[1].pattern_id).toBe("pat_002");
    expect(result.recommended_patterns[1].confidence_score).toBe(71.2);
    expect(result.reasoning_summary).toBe(
      "内部パターンマスタから統計的に上位の成功パターンを取得しました。詳細な分析は後ほど再試行します。"
    );
    expect(result.fallback_reason).toContain("timeout");
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_id: "cust_20240515_001",
        deal_stage: "discovery",
      })
    );
  });
});