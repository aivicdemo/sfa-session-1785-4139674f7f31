import { describe, test, expect } from "@jest/globals";
import { calculatePatternMatchDegree } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-600
  test("顧客対応パターンが成功パターンと部分的に合致している場合、合致度が0から100の間の数値として正確に計算される", () => {
    const successful_pattern = [
      "initial_contact",
      "needs_confirmation",
      "proposal",
      "closing",
    ];

    const actual_pattern = [
      "initial_contact",
      "needs_confirmation",
      "proposal",
    ];

    const match_degree = calculatePatternMatchDegree(
      successful_pattern,
      actual_pattern
    );

    expect(match_degree).toBe(60);
    expect(match_degree).toBeGreaterThanOrEqual(0);
    expect(match_degree).toBeLessThanOrEqual(100);
    expect(Number.isInteger(match_degree)).toBe(true);
  });
});