import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けルール生成機能", () => {
  // SCEN-2762
  test("成功商談と失敗商談の両方が含まれる場合、両者の特徴量差分が正しく計算される", () => {
    // 顧客規模のマッピング: L=3, M=2, S=1（数値化）
    // 予算レベルのマッピング: 高=3, 中=2, 低=1（数値化）
    // 決定者数のマッピング: 複数=2, 単数=1（数値化）

    const successful_deals = [
      {
        deal_id: "success_001",
        customer_size: 3, // L
        budget_level: 3, // 高
        decision_makers_count: 2, // 複数
        outcome: "成約",
      },
      {
        deal_id: "success_002",
        customer_size: 2, // M
        budget_level: 2, // 中
        decision_makers_count: 1, // 単数
        outcome: "成約",
      },
      {
        deal_id: "success_003",
        customer_size: 1, // S
        budget_level: 1, // 低
        decision_makers_count: 2, // 複数
        outcome: "成約",
      },
    ];

    const failed_deals = [
      {
        deal_id: "failed_001",
        customer_size: 3, // L
        budget_level: 1, // 低
        decision_makers_count: 1, // 単数
        outcome: "失敗",
      },
      {
        deal_id: "failed_002",
        customer_size: 2, // M
        budget_level: 3, // 高
        decision_makers_count: 2, // 複数
        outcome: "失敗",
      },
    ];

    const all_deals = [...successful_deals, ...failed_deals];

    // AIRecommendationEngineのスタブ
    const ai_engine_stub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 重み付けルール生成機能を実行
    const result = extractSuccessPatterns(all_deals, ai_engine_stub);

    // 期待値の計算
    // 成功商談の平均特徴量
    const success_avg_customer_size =
      (3 + 2 + 1) / 3; // (L+M+S)/3 = 6/3 = 2.0
    const success_avg_budget_level =
      (3 + 2 + 1) / 3; // (高+中+低)/3 = 6/3 = 2.0
    const success_avg_decision_makers =
      (2 + 1 + 2) / 3; // (複数+単数+複数)/3 = 5/3 ≈ 1.6667

    // 失敗商談の平均特徴量
    const failed_avg_customer_size = (3 + 2) / 2; // (L+M)/2 = 5/2 = 2.5
    const failed_avg_budget_level = (1 + 3) / 2; // (低+高)/2 = 4/2 = 2.0
    const failed_avg_decision_makers = (1 + 2) / 2; // (単数+複数)/2 = 3/2 = 1.5

    // 特徴量差分
    const customer_size_diff =
      success_avg_customer_size - failed_avg_customer_size; // 2.0 - 2.5 = -0.5
    const budget_level_diff =
      success_avg_budget_level - failed_avg_budget_level; // 2.0 - 2.0 = 0.0
    const decision_makers_diff =
      success_avg_decision_makers - failed_avg_decision_makers; // 1.6667 - 1.5 = 0.1667

    // 検証: 計算された差分値が正確であることを確認
    expect(result.feature_differences.customer_size_diff).toBeCloseTo(
      customer_size_diff,
      5
    );
    expect(result.feature_differences.budget_level_diff).toBeCloseTo(
      budget_level_diff,
      5
    );
    expect(result.feature_differences.decision_makers_diff).toBeCloseTo(
      decision_makers_diff,
      4
    );

    // 検証: 差分値が推奨パターンマスタに記録されていることを確認
    expect(result.recommendation_pattern_master).toBeDefined();
    expect(result.recommendation_pattern_master.customer_size_weight).toBe(
      customer_size_diff
    );
    expect(result.recommendation_pattern_master.budget_level_weight).toBe(
      budget_level_diff
    );
    expect(
      result.recommendation_pattern_master.decision_makers_weight
    ).toBeCloseTo(decision_makers_diff, 4);

    // 検証: パターンマスタが以後の重み付けルール適用に使用可能な状態であることを確認
    expect(result.recommendation_pattern_master.applicable).toBe(true);
    expect(result.recommendation_pattern_master.weights_ready).toBe(true);
  });
});