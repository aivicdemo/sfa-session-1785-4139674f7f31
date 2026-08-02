import { calculateImprovementPriorityScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-333
  test("相関係数が正の値となる場合、改善指導の優先順位が適切に計算される", () => {
    const correlation_coefficient = 0.75;
    const expected_priority_score = 3;

    const actual_priority_score = calculateImprovementPriorityScore(
      correlation_coefficient
    );

    expect(actual_priority_score).toBe(expected_priority_score);

    const second_call_priority_score = calculateImprovementPriorityScore(
      correlation_coefficient
    );

    expect(second_call_priority_score).toBe(expected_priority_score);
  });
});