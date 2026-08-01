import { executeHealthCheck } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-233: システムヘルスチェック判定機能 - AIエージェント推論精度が0%のとき不合格判定が出力される", () => {
    const ai_inference_accuracy_score = 0.0;
    const system_operation_status = "HEALTHY";
    const business_data_quality_score = 95.0;

    const result = executeHealthCheck({
      ai_inference_accuracy_score,
      system_operation_status,
      business_data_quality_score,
    });

    expect(result.health_judgment).toBe("FAILED");
    expect(result.health_status).toBe("FAILED");
    expect(result.ai_inference_accuracy_score).toBe(0.0);
    expect(result.diagnostic_message).toMatch(
      /AIエージェント推論精度が基準値未満です/
    );
  });
});