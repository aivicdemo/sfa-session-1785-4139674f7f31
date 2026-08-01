import { calculatePriorityScores } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-661
  test("改善優先度スコア算出機能 - 問題パターン0件のとき空配列が返される", () => {
    const problemPatterns: Array<{
      patternId: string;
      impactFrequency: number;
      severity: number;
    }> = [];

    const result = calculatePriorityScores(problemPatterns);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});