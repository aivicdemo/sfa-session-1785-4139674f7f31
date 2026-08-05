import { describe, test, expect } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-531: AIエージェント推論ログが複数件存在する場合、全体の推論精度が正確に計算される", async () => {
    const { calculateAiAgentInferenceAccuracy } = await import(
      "../../src/logic/it-1-br-2-1-1-1"
    );

    const inference_logs = [
      {
        inference_id: "LOG001",
        inference_result: "正解",
        confidence_score: 0.95,
      },
      {
        inference_id: "LOG002",
        inference_result: "正解",
        confidence_score: 0.87,
      },
      {
        inference_id: "LOG003",
        inference_result: "不正解",
        confidence_score: 0.62,
      },
    ];

    const result = calculateAiAgentInferenceAccuracy(inference_logs);

    expect(result).toBe(66.67);
  });
});