import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1039
  test("推論実行日時が欠落しているとき推論精度監視がエラーになること", () => {
    const monitoringRecordWithNullTimestamp = {
      recordId: "mon-20240115-001",
      inferenceModelId: "model-v2-001",
      inferenceResult: "提案内容適合度: 高",
      accuracyScore: 92,
      inferenceExecutedAt: null,
      createdAt: new Date("2024-01-15T10:00:00Z"),
    };

    expect(() =>
      monitorInferenceAccuracy(monitoringRecordWithNullTimestamp)
    ).toThrow(/推論実行日時/);
  });
});