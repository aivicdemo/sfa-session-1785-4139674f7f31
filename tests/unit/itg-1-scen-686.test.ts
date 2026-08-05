import { validateAIInferencePrecisionThreshold } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-686
  test("推論精度の閾値が負の値のとき無効な設定としてエラーになる", () => {
    const invalid_threshold_negative = -0.5;

    expect(() => {
      validateAIInferencePrecisionThreshold({
        thresholdValue: invalid_threshold_negative,
      });
    }).toThrow(/INVALID_THRESHOLD_NEGATIVE/);
  });
});