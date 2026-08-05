import { describe, test, expect } from "@jest/globals";
import { calculateAiInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-749
  test("信頼度パラメータが NaN のときエラーが発生する", () => {
    const input = {
      correct_predictions: 95,
      total_predictions: 100,
      confidence_parameter: NaN,
    };

    expect(() => calculateAiInferenceAccuracyScore(input)).toThrow(
      /INVALID_CONFIDENCE_PARAMETER/
    );
  });
});