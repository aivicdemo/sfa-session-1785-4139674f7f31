import { calculatePriorityScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-573
  test("優先度スコアの計算機能 - 優先度スコアが最小値0になる場合、0として計算される", () => {
    const customerImportance = 0;
    const dealAmount = 0;
    const responseDeadlineDays = 0;
    const followUpFrequency = 0;
    const successProbability = 0;

    const result = calculatePriorityScore({
      customerImportance,
      dealAmount,
      responseDeadlineDays,
      followUpFrequency,
      successProbability,
    });

    expect(typeof result).toBe("number");
    expect(result).toBe(0);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});