import { monitorAIAgentInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-431
  test("アラート設定が存在しない場合、監視が実行されずエラーとして処理される", () => {
    const input = {
      alertConfigs: [],
      inferenceAccuracyData: [
        {
          inferenceLogId: "log-001",
          accuracy: 0.92,
          timestamp: new Date("2024-01-15T10:00:00Z"),
        },
        {
          inferenceLogId: "log-002",
          accuracy: 0.87,
          timestamp: new Date("2024-01-15T10:15:00Z"),
        },
      ],
      systemLogRecorder: (message: string) => {
        expect(message).toMatch(/アラート設定が存在しないため監視は実行されません/);
      },
    };

    expect(() => {
      monitorAIAgentInferenceAccuracy(input);
    }).toThrow(/ALERT_CONFIG_NOT_FOUND/);
  });
});