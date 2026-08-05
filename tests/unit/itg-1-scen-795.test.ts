import { describe, test, expect } from "@jest/globals";
import { classifyAndPrioritizeIssues } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-795
  test("複数の問題が存在し、問題リスト内に不正形式のオブジェクトが混在する場合、バリデーションエラーが発生すること", () => {
    const issues = [
      {
        id: "issue_001",
        severity: "high",
        category: "process_deviation",
        description: "Process step deviation detected",
        affectedCount: 5,
      },
      {
        id: "issue_002",
        // severity field is missing
        category: "data_quality",
        description: "Data quality issue",
        affectedCount: 3,
      },
      {
        id: "issue_003",
        severity: "low",
        category: "inference_accuracy",
        description: "Inference accuracy below threshold",
        affectedCount: 2,
      },
    ];

    expect(() => classifyAndPrioritizeIssues(issues)).toThrow(
      /不正な問題オブジェクト形式|インデックス.*1|バリデーション/i
    );
  });
});