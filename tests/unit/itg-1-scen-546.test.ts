import { extractProblemsRequiringAction } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-546: 対応すべき問題の抽出機能 - 対応不要と判定された問題は抽出結果に含まれない", () => {
    // テスト対象の問題抽出機能の初期化
    const problem_1 = {
      problem_id: "P001",
      status: "対応不要",
      priority: "高",
      detection_date: "2024-01-15",
    };

    const problem_2 = {
      problem_id: "P002",
      status: "対応必要",
      priority: "中",
      detection_date: "2024-01-16",
    };

    const problem_3 = {
      problem_id: "P003",
      status: "対応不要",
      priority: "低",
      detection_date: "2024-01-17",
    };

    // 作成した3件の問題データをシステムに登録
    const all_problems = [problem_1, problem_2, problem_3];

    // 問題抽出機能を実行し、抽出結果を取得
    const extracted_problems = extractProblemsRequiringAction(all_problems);

    // 抽出結果の件数と問題IDを確認
    expect(extracted_problems.length).toBe(1);
    expect(extracted_problems[0].problem_id).toBe("P002");
    expect(extracted_problems[0].status).toBe("対応必要");
    expect(extracted_problems[0].priority).toBe("中");
    expect(extracted_problems[0].detection_date).toBe("2024-01-16");
  });
});