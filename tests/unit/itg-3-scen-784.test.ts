import { calculateTrustScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-784: 推奨信頼度スコア算出機能 - 過去成功パターンが複数件のとき、信頼度スコアが正常に算出される", () => {
    // パターンAのセットアップ
    const patternA = {
      id: "pattern_001",
      relevanceScore: 0.92,
    };

    // パターンBのセットアップ
    const patternB = {
      id: "pattern_002",
      relevanceScore: 0.78,
    };

    // パターンCのセットアップ
    const patternC = {
      id: "pattern_003",
      relevanceScore: 0.85,
    };

    // 新規案件データの準備
    const newDealData = {
      customerIndustry: "製造業",
      dealAmount: 5000000,
      decisionMakerCount: 3,
    };

    // テスト対象関数を呼び出し
    const result = calculateTrustScore(newDealData, [patternA, patternB, patternC]);

    // 期待値の計算: (0.92 + 0.78 + 0.85) / 3 = 0.85
    const expectedTrustScore = 0.85;

    // 信頼度スコアの検証（±0.01の範囲内）
    expect(result.trustScore).toBeGreaterThanOrEqual(expectedTrustScore - 0.01);
    expect(result.trustScore).toBeLessThanOrEqual(expectedTrustScore + 0.01);

    // 評価されたパターン数の検証
    expect(result.evaluatedPatternCount).toBe(3);

    // 使用されたパターンIDの検証
    expect(result.usedPatterns).toEqual(["pattern_001", "pattern_002", "pattern_003"]);

    // 計算タイムスタンプがISO8601形式であることを検証
    expect(result.calculationTimestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
    );

    // 返却オブジェクトに必須フィールドがすべて含まれていることを確認
    expect(result).toHaveProperty("trustScore");
    expect(result).toHaveProperty("evaluatedPatternCount");
    expect(result).toHaveProperty("usedPatterns");
    expect(result).toHaveProperty("calculationTimestamp");
  });
});