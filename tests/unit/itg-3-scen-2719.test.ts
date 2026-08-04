import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2719
  test("推奨根拠に参照した成功パターンの詳細情報が紐付けられて表示される", async () => {
    // 準備: テストデータ
    const new_deal_info = {
      customer_size: "中堅企業",
      industry: "製造業",
      business_challenge: "生産効率化",
    };

    // スタブ: AIRecommendationEngine.findSimilarPatterns
    const similar_patterns = [
      {
        past_deal_id: "PA-2024-001",
        contract_date: "2024-03-15",
        proposal_approach: "IoT導入による工程管理の最適化",
        relevance_score: 0.92,
        customer_industry: "製造業",
        customer_size: "中堅企業",
        negotiation_period_days: 45,
        contract_amount: 2500000,
      },
      {
        past_deal_id: "PB-2024-005",
        contract_date: "2024-02-28",
        proposal_approach: "AI予測メンテナンスシステム",
        relevance_score: 0.87,
        customer_industry: "製造業",
        customer_size: "中堅企業",
        negotiation_period_days: 52,
        contract_amount: 1800000,
      },
      {
        past_deal_id: "PC-2023-042",
        contract_date: "2023-11-10",
        proposal_approach: "デジタル化による業務フロー改善",
        relevance_score: 0.79,
        customer_industry: "製造業",
        customer_size: "中堅企業",
        negotiation_period_days: 38,
        contract_amount: 1200000,
      },
    ];

    const mock_find_similar_patterns = jest.fn().mockResolvedValue(
      similar_patterns
    );

    // スタブ: AIRecommendationEngine.generateRecommendation
    const recommendation_result = {
      recommendation_basis: "検索された成功パターンはPA-2024-001, PB-2024-005, PC-2023-042に基づいている",
      recommended_approach: "IoT導入とAI予測メンテナンスの段階的導入",
      confidence_score: 0.88,
      referenced_pattern_ids: ["PA-2024-001", "PB-2024-005", "PC-2023-042"],
    };

    const mock_generate_recommendation = jest.fn().mockResolvedValue(
      recommendation_result
    );

    const mock_engine = {
      findSimilarPatterns: mock_find_similar_patterns,
      generateRecommendation: mock_generate_recommendation,
    };

    // Import target logic
    const { visualize_recommendation_basis } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    // 実行: 推奨根拠の可視化
    const result = await visualize_recommendation_basis(
      new_deal_info,
      mock_engine
    );

    // 検証: 推奨根拠に参照成功パターンが含まれている
    expect(result).toHaveProperty("recommendation_basis");
    expect(result.recommendation_basis).toMatch(/PA-2024-001/);
    expect(result.recommendation_basis).toMatch(/PB-2024-005/);
    expect(result.recommendation_basis).toMatch(/PC-2023-042/);

    // 検証: 参照パターン詳細情報が返却される
    expect(result).toHaveProperty("referenced_patterns");
    expect(Array.isArray(result.referenced_patterns)).toBe(true);
    expect(result.referenced_patterns.length).toBe(3);

    // 検証: 最初のパターン（PA-2024-001）の詳細情報
    const pattern_a = result.referenced_patterns.find(
      (p: { past_deal_id: string }) => p.past_deal_id === "PA-2024-001"
    );
    expect(pattern_a).toBeDefined();
    expect(pattern_a.past_deal_id).toBe("PA-2024-001");
    expect(pattern_a.contract_date).toBe("2024-03-15");
    expect(pattern_a.customer_industry).toBe("製造業");
    expect(pattern_a.customer_size).toBe("中堅企業");
    expect(pattern_a.proposal_approach).toBe(
      "IoT導入による工程管理の最適化"
    );
    expect(pattern_a.relevance_score).toBe(0.92);
    expect(pattern_a.negotiation_period_days).toBe(45);
    expect(pattern_a.contract_amount).toBe(2500000);

    // 検証: 2番目のパターン（PB-2024-005）の詳細情報
    const pattern_b = result.referenced_patterns.find(
      (p: { past_deal_id: string }) => p.past_deal_id === "PB-2024-005"
    );
    expect(pattern_b).toBeDefined();
    expect(pattern_b.past_deal_id).toBe("PB-2024-005");
    expect(pattern_b.contract_date).toBe("2024-02-28");
    expect(pattern_b.customer_industry).toBe("製造業");
    expect(pattern_b.customer_size).toBe("中堅企業");
    expect(pattern_b.proposal_approach).toBe("AI予測メンテナンスシステム");
    expect(pattern_b.relevance_score).toBe(0.87);
    expect(pattern_b.negotiation_period_days).toBe(52);
    expect(pattern_b.contract_amount).toBe(1800000);

    // 検証: 3番目のパターン（PC-2023-042）の詳細情報
    const pattern_c = result.referenced_patterns.find(
      (p: { past_deal_id: string }) => p.past_deal_id === "PC-2023-042"
    );
    expect(pattern_c).toBeDefined();
    expect(pattern_c.past_deal_id).toBe("PC-2023-042");
    expect(pattern_c.contract_date).toBe("2023-11-10");
    expect(pattern_c.customer_industry).toBe("製造業");
    expect(pattern_c.customer_size).toBe("中堅企業");
    expect(pattern_c.proposal_approach).toBe("デジタル化による業務フロー改善");
    expect(pattern_c.relevance_score).toBe(0.79);
    expect(pattern_c.negotiation_period_days).toBe(38);
    expect(pattern_c.contract_amount).toBe(1200000);

    // 検証: すべての適用スコアが指定範囲内（0.79～0.92）
    result.referenced_patterns.forEach(
      (pattern: { relevance_score: number }) => {
        expect(pattern.relevance_score).toBeGreaterThanOrEqual(0.79);
        expect(pattern.relevance_score).toBeLessThanOrEqual(0.92);
      }
    );

    // 検証: モック呼び出しが実行された
    expect(mock_find_similar_patterns).toHaveBeenCalledWith(new_deal_info);
    expect(mock_generate_recommendation).toHaveBeenCalledWith(
      new_deal_info,
      similar_patterns
    );
  });
});