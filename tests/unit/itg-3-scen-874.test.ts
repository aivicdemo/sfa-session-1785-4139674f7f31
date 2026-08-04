import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨信頼度スコア算出機能", () => {
  test("SCEN-874: 適用可能性評価結果に重複データを含むとき信頼度スコアから重複分が排除される", async () => {
    // Setup: 重複した評価結果オブジェクトを構築
    const duplicate_evaluation_results = [
      { pattern_id: "pattern-001", relevance_score: 0.85 },
      { pattern_id: "pattern-001", relevance_score: 0.85 },
      { pattern_id: "pattern-001", relevance_score: 0.85 },
    ];

    // Mock for AIRecommendationEngine
    const mock_ai_engine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValue(duplicate_evaluation_results),
    };

    // Execute: 推奨信頼度スコア算出機能を呼び出し
    const input_context = {
      customer_industry: "manufacturing",
      deal_size_range: "large",
      sales_stage: "discovery",
    };

    const calculation_result = await evaluatePatternRelevance(
      input_context,
      mock_ai_engine
    );

    // Assertion 1: 推奨信頼度スコアが0.85として算出される
    expect(calculation_result.confidence_score).toBe(0.85);

    // Assertion 2: 処理時に重複排除が実施されたことをログから確認
    expect(calculation_result.deduplication_log).toMatch(/pattern-001/);
    expect(calculation_result.deduplication_log).toMatch(/2件排除/);

    // Assertion 3: 重複排除前のデータ件数が3件
    expect(calculation_result.evaluation_count_before_dedup).toBe(3);

    // Assertion 4: 重複排除後のデータ件数が1件
    expect(calculation_result.evaluation_count_after_dedup).toBe(1);

    // Assertion 5: 内部ログに正確なメッセージが記録されている
    expect(calculation_result.deduplication_log).toBe(
      "重複パターンID pattern-001 を2件排除"
    );
  });
});