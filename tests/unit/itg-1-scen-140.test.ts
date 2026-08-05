import { validateInferenceExecutionData } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-140
  test("品質検証ステータスが空文字のとき推論実行が保留される", () => {
    const request = {
      qualityValidationStatus: "",
      inferenceStartTime: new Date("2024-01-15T09:00:00Z"),
      salesDataId: "sales_data_001",
      targetPeriodStart: new Date("2024-01-01T00:00:00Z"),
      targetPeriodEnd: new Date("2024-01-31T23:59:59Z"),
    };

    const result = validateInferenceExecutionData(request);

    expect(result.status).toBe("INFERENCE_PENDING");
    expect(result.inferenceAllowed).toBe(false);
    expect(result.logMessage).toMatch(/品質検証ステータスが未設定のため推論実行を保留/);
  });
});