import { determineProblemReportingRequired } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-577
  test("問題検出結果の重要度が最高レベルの場合、報告必要フラグがtrueで報告区分が『要報告』と判定される", () => {
    const detectionResult = {
      detectionId: "detection_001",
      severity: "最高",
      description: "推論精度が閾値を下回りました",
      detectedAt: new Date("2024-01-15T10:30:00Z"),
      affectedRecords: 150,
    };

    const result = determineProblemReportingRequired(detectionResult);

    expect(result.reportingRequired).toBe(true);
    expect(result.reportingCategory).toBe("要報告");
  });
});