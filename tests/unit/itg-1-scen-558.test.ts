import { groupProblemsByResponseTiming } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-558: [normal] 対応時期別の問題グループ化機能 - 長期対応の問題が正しくグループ分けされる", () => {
    // 準備: 基準日時を固定
    const now = new Date("2024-12-15T00:00:00Z");
    const ninetyDaysAgo = new Date(now);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // 準備: 問題データセット（90日以上前の問題5件、60日以上90日未満の問題3件）
    const problemDataset = [
      {
        problem_id: "P001",
        created_at: new Date(ninetyDaysAgo.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "high",
        description: "Problem created 95 days ago",
      },
      {
        problem_id: "P002",
        created_at: new Date(ninetyDaysAgo.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "high",
        description: "Problem created 100 days ago",
      },
      {
        problem_id: "P003",
        created_at: new Date(ninetyDaysAgo.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "medium",
        description: "Problem created 105 days ago",
      },
      {
        problem_id: "P004",
        created_at: new Date(ninetyDaysAgo.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "medium",
        description: "Problem created 110 days ago",
      },
      {
        problem_id: "P005",
        created_at: new Date(ninetyDaysAgo.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "low",
        description: "Problem created 115 days ago",
      },
      {
        problem_id: "P006",
        created_at: new Date(sixtyDaysAgo.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "medium",
        description: "Problem created 65 days ago",
      },
      {
        problem_id: "P007",
        created_at: new Date(sixtyDaysAgo.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "low",
        description: "Problem created 70 days ago",
      },
      {
        problem_id: "P008",
        created_at: new Date(sixtyDaysAgo.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        severity: "low",
        description: "Problem created 75 days ago",
      },
    ];

    // 実行: 問題グループ化機能を実行
    const result = groupProblemsByResponseTiming(problemDataset, now.toISOString());

    // 検証: 結果に long_term グループが存在すること
    expect(result).toHaveProperty("long_term");

    // 検証: long_term グループに正確に5つの問題が含まれていること
    const longTermProblems = result.long_term;
    expect(longTermProblems).toHaveLength(5);

    // 検証: long_term グループのすべての問題IDが P001～P005 のいずれかであること
    const longTermProblemIds = longTermProblems.map(
      (p: { problem_id: string }) => p.problem_id
    );
    expect(longTermProblemIds.sort()).toEqual(["P001", "P002", "P003", "P004", "P005"]);

    // 検証: long_term グループのすべての問題の作成日が90日以上前であること
    longTermProblems.forEach(
      (problem: { problem_id: string; created_at: string; created_days_ago: number }) => {
        expect(problem.created_days_ago).toBeGreaterThanOrEqual(90);
      }
    );

    // 検証: P006, P007, P008（60日以上90日未満の問題）が long_term に含まれていないこと
    expect(longTermProblemIds).not.toContain("P006");
    expect(longTermProblemIds).not.toContain("P007");
    expect(longTermProblemIds).not.toContain("P008");

    // 検証: 60～90日未満の問題が medium_term グループに分類されること
    expect(result).toHaveProperty("medium_term");
    const mediumTermProblemIds = result.medium_term.map(
      (p: { problem_id: string }) => p.problem_id
    );
    expect(mediumTermProblemIds.sort()).toEqual(["P006", "P007", "P008"]);
  });
});