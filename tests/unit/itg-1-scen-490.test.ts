import { monitorAiInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-490
  test("アラート履歴テーブルが欠落している場合、エラーを返す", () => {
    const mockDbConnection = {
      query: jest.fn().mockRejectedValueOnce(
        new Error(
          "テーブル名: alert_history, データベースエラー: 指定されたテーブルが存在しません"
        )
      ),
    };

    const input = {
      db_connection: mockDbConnection,
      inference_log_ids: ["log_001", "log_002"],
      monitoring_threshold_accuracy: 0.95,
      timestamp: new Date("2024-01-15T10:00:00Z"),
    };

    expect(() => monitorAiInferenceAccuracy(input)).toThrow(/alert_history/);
  });
});