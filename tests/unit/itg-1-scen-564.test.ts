import { validateInferenceThreshold } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-564
  test("推論精度の閾値が100を超える場合、エラーになる", () => {
    const invalid_threshold = 101;

    expect(() => {
      validateInferenceThreshold(invalid_threshold);
    }).toThrow(/推論精度の閾値/);
  });
});