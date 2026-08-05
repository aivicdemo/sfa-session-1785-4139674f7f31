import { validateInferenceLogExecutedAt } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-489: 推論ログの実行日時が欠落している場合、エラーを返す", () => {
    const stubLogWithoutExecutedAt = {
      inferenceLogId: "log-001",
      agentId: "agent-001",
      executedAt: null,
      inputData: { dealId: "deal-123" },
      outputResult: { recommendation: "follow-up" },
      confidence: 0.85,
      processingTimeMs: 1500,
    };

    expect(() => validateInferenceLogExecutedAt(stubLogWithoutExecutedAt)).toThrow(
      /MISSING_EXECUTED_AT/
    );
  });
});