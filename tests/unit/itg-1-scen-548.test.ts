import { extractProblemsRequiringAction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-548: 対応すべき問題が1件の場合、その問題が抽出される", () => {
    // テストデータ: 未対応かつ重要度が高く、カテゴリが営業プロセス違反の問題1件
    const problems = [
      {
        problemId: "PROB-001",
        status: "未対応",
        severity: "高",
        category: "営業プロセス違反",
        detectedAt: "2024-01-15T10:30:00Z",
        description: "営業プロセス標準からの乖離を検出"
      }
    ];

    // 対応すべき問題の抽出機能を実行
    const result = extractProblemsRequiringAction(problems);

    // 抽出結果の件数を確認: 1件のみが返却される
    expect(result).toHaveLength(1);

    // 抽出された問題の詳細情報を確認
    const extractedProblem = result[0];
    expect(extractedProblem.problemId).toBe("PROB-001");
    expect(extractedProblem.status).toBe("未対応");
    expect(extractedProblem.severity).toBe("高");
    expect(extractedProblem.category).toBe("営業プロセス違反");
  });
});