import { classifyProblemSeverityAndPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-527
  test("問題検出結果の重要度・優先度分類機能 - 問題の重要度値が欠けている場合、処理が失敗する", () => {
    const problemDetectionResult = {
      problemId: "PROB-001",
      category: "提案内容不適合",
      detectionDate: new Date("2024-01-15T10:30:00Z"),
      severity: undefined,
      description: "顧客ニーズと提案内容の乖離を検出",
      affectedSalesRepId: "SR-0001",
    };

    expect(() =>
      classifyProblemSeverityAndPriority(problemDetectionResult)
    ).toThrow(/重要度値/);
  });
});