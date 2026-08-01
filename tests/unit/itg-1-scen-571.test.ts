import { calculatePrioritizationScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-571
  test("優先度スコアの計算機能 - 複数の優先度因子から優先度スコアが正しく計算される", () => {
    const priorityFactors = {
      dealAmount: 80,
      closeProbability: 70,
      customerImportance: 90,
      urgencyDegree: 85,
    };

    const weights = {
      dealAmount: 0.3,
      closeProbability: 0.25,
      customerImportance: 0.25,
      urgencyDegree: 0.2,
    };

    const result = calculatePrioritizationScore(priorityFactors, weights);

    const expectedScore =
      80 * 0.3 + 70 * 0.25 + 90 * 0.25 + 85 * 0.2;

    expect(result).toBe(expectedScore);
  });
});