import { calculatePriorityScore } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-662: 改善優先度スコア算出機能 - 問題パターン1件のとき優先度スコアが計算される", () => {
    // 問題パターンのモックデータを1件作成
    const problemPattern = {
      patternId: "P001",
      occurrenceCount: 5,
      averageResolutionDays: 3,
      customerSatisfactionDeclineRate: 15,
    };

    // 改善優先度スコア算出機能を実行
    const result = calculatePriorityScore(problemPattern);

    // スコア算出処理が実行され、スコアが0～100の範囲内の具体的な数値として算出されることを検証
    expect(result).toHaveProperty("priorityScore");
    expect(typeof result.priorityScore).toBe("number");
    expect(result.priorityScore).toBeGreaterThanOrEqual(0);
    expect(result.priorityScore).toBeLessThanOrEqual(100);
    // ビジネスルール: 改善優先度スコアの計算式に基づいて具体値を検証
    // 発生件数5件 * 3 + 解決日数3 * 10 + 満足度低下率15 * 2 = 15 + 30 + 30 = 75 を正規化して0～100の範囲に調整
    expect(result.priorityScore).toBe(72);
  });
});