import { calculateImportanceScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-565
  test("重要度スコアの計算機能 - 複数の問題要因から重要度スコアが正しく計算される", () => {
    const problem_factors = [
      {
        factor_name: "売上目標未達",
        weight: 0.4,
        score: 80,
      },
      {
        factor_name: "顧客満足度低下",
        weight: 0.3,
        score: 60,
      },
      {
        factor_name: "営業プロセス逸脱",
        weight: 0.2,
        score: 75,
      },
      {
        factor_name: "コンプライアンス違反",
        weight: 0.1,
        score: 90,
      },
    ];

    const result = calculateImportanceScore(problem_factors);

    const expected_score = 80 * 0.4 + 60 * 0.3 + 75 * 0.2 + 90 * 0.1;
    expect(result).toBe(expected_score);
  });
});