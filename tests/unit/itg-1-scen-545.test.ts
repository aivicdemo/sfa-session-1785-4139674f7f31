import { extractProblemsRequiringAction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-545: [normal] 対応すべき問題の抽出機能 - 複数の問題から対応が必要な問題だけが抽出される
  test("対応が必要な問題（ステータスが『対応待ち』または『対応中』）だけが抽出される", () => {
    const problem_a = {
      id: "problem_a",
      status: "対応待ち",
      priority: "高",
      deadline: "2024-01-15",
    };

    const problem_b = {
      id: "problem_b",
      status: "完了",
      priority: "中",
      deadline: "2024-01-10",
    };

    const problem_c = {
      id: "problem_c",
      status: "対応中",
      priority: "高",
      deadline: "2024-01-20",
    };

    const problem_d = {
      id: "problem_d",
      status: "保留",
      priority: "低",
      deadline: "2024-02-01",
    };

    const problem_e = {
      id: "problem_e",
      status: "対応待ち",
      priority: "中",
      deadline: "2024-01-25",
    };

    const all_problems = [problem_a, problem_b, problem_c, problem_d, problem_e];
    const extraction_condition = {
      target_statuses: ["対応待ち", "対応中"],
    };

    const result = extractProblemsRequiringAction(
      all_problems,
      extraction_condition
    );

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "problem_a",
          status: "対応待ち",
          priority: "高",
          deadline: "2024-01-15",
        }),
        expect.objectContaining({
          id: "problem_c",
          status: "対応中",
          priority: "高",
          deadline: "2024-01-20",
        }),
        expect.objectContaining({
          id: "problem_e",
          status: "対応待ち",
          priority: "中",
          deadline: "2024-01-25",
        }),
      ])
    );

    const result_ids = result.map((p) => p.id);
    expect(result_ids).not.toContain("problem_b");
    expect(result_ids).not.toContain("problem_d");
  });
});