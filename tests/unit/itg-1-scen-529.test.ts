import { classifyProblemByImportanceAndPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-529
  test("問題の重要度値が無効な値の場合、処理が失敗する", () => {
    const invalidImportanceValues = [-1, 999, null, undefined, "", "invalid"];

    invalidImportanceValues.forEach((invalidValue) => {
      expect(() =>
        classifyProblemByImportanceAndPriority({
          problemId: "prob_001",
          detectionTimestamp: new Date("2024-01-15T10:00:00Z"),
          importance: invalidValue as any,
          frequency: 5,
          affectedSalesCount: 10,
        })
      ).toThrow(/重要度値/);
    });
  });
});