import { classifyDetectionResultByPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-530
  test("問題検出結果の重要度・優先度分類機能 - 優先度値が無効な値の場合エラーを返却", () => {
    const invalidPriorityValues = [-1, 1000, null, undefined, "invalid"];

    invalidPriorityValues.forEach((invalidPriority) => {
      const detectionResult = {
        detection_id: "det_001",
        issue_type: "提案内容不適切",
        severity: "high",
        priority: invalidPriority,
        detected_at: new Date("2024-01-15T10:30:00Z"),
        sales_person_id: "sp_001",
      };

      expect(() => {
        classifyDetectionResultByPriority(detectionResult);
      }).toThrow(/INVALID_PRIORITY_VALUE/);
    });
  });
});