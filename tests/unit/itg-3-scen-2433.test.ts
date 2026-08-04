import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-2433: [edge] 推奨精度スコア算出機能 - 過去成功パターンがランダム順でソートされているとき最高スコアが返却される", () => {
    // 手順1: 3つ以上の異なるスコア値を持つパターンオブジェクト配列を準備
    const pattern_1 = {
      pattern_id: "pat_001",
      pattern_name: "成功パターンA",
      score: 0.85,
    };
    const pattern_2 = {
      pattern_id: "pat_002",
      pattern_name: "成功パターンB",
      score: 0.92,
    };
    const pattern_3 = {
      pattern_id: "pat_003",
      pattern_name: "成功パターンC",
      score: 0.78,
    };

    // 手順2: 意図的にシャッフルして配列順序を崩す
    // 元の順序: 0.85, 0.92, 0.78 → シャッフル後: 0.78, 0.85, 0.92 -> さらに崩す: 0.92, 0.78, 0.85
    const shuffled_patterns = [pattern_2, pattern_3, pattern_1];

    // 手順3: AIRecommendationEngineをスタブ化
    const mock_engine = {
      evaluatePatternRelevance: jest.fn((pattern) => {
        return pattern.score;
      }),
    };

    // 手順4: 新規案件の顧客・商談条件を準備
    const new_deal_condition = {
      customer_id: "cust_123",
      customer_industry: "manufacturing",
      customer_scale: "large",
      deal_stage: "proposal",
    };

    // 手順5: 推奨精度スコア算出機能に入力を渡す
    const calculated_score = evaluatePatternRelevance(
      shuffled_patterns,
      new_deal_condition,
      mock_engine
    );

    // 手順6: 期待値を検証
    // 配列内のスコア値: 0.92, 0.78, 0.85
    // 最大値: 0.92
    const max_expected_score = 0.92;

    expect(calculated_score).toBe(max_expected_score);
  });
});