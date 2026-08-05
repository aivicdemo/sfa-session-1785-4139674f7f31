import { describe, test, expect, beforeEach } from "@jest/globals";
import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-747
  test("信頼度パラメータが負の値のときエラーになる", () => {
    const negativeConfidenceParams = {
      correctPredictions: 85,
      totalPredictions: 100,
      confidenceLevel: -0.5,
    };

    expect(() =>
      calculateInferenceAccuracyScore(negativeConfidenceParams)
    ).toThrow(/信頼度パラメータ/);
  });
});