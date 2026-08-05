import { validateAIAgentInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-691: 実測精度値が負の値のとき無効なデータとしてエラーになる", () => {
    // Arrange
    const invalid_measured_precision = -0.5;

    // Act & Assert
    expect(() =>
      validateAIAgentInferencePrecision({
        measured_precision: invalid_measured_precision,
      })
    ).toThrow(/実測精度値は0以上1以下の値である必要があります/);
  });
});