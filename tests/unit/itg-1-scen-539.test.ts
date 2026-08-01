import { calculateResponseTimingForProblem } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-539: 問題の重要度が対応時期判定の基準値未満の場合、対応時期が正しく判定される", () => {
    const problem = {
      id: "problem_001",
      severity: "中",
      detectedAt: new Date("2024-01-15T11:00:00Z"),
      description: "データ品質スコア低下"
    };

    const result = calculateResponseTimingForProblem(problem, "高");

    expect(result.responseTime).toBe("30日以内対応");
  });
});