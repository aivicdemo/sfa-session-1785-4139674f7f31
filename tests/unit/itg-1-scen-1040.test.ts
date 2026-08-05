import { monitorInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1040
  test("推論結果が欠落しているとき推論精度監視がエラーになること", () => {
    const mockInferenceContext = {
      inferenceEngineResult: null,
    };

    const result = monitorInferencePrecision(mockInferenceContext);

    expect(result.statusCode).toBe(400);
    expect(result.errorCode).toBe("INFERENCE_RESULT_MISSING");
    expect(result.errorMessage).toBe(
      "Inference result is missing and cannot calculate precision metrics"
    );
  });
});