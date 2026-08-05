import { describe, test, expect } from "@jest/globals";
import { validateInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-1201: 推論精度が100を超える値のときエラーになる", () => {
    const accuracyValue = 101;

    expect(() => {
      validateInferenceAccuracy(accuracyValue);
    }).toThrow(/推論精度は0～100の範囲で指定してください/);
  });
});