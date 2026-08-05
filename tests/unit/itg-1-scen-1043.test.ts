import { monitorInferencePrecision } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1043
  test("推論精度が負の値のとき推論精度監視がエラーになること", () => {
    const negative_precision = -0.5;

    expect(() => monitorInferencePrecision(negative_precision)).toThrow(/推論精度/);
  });
});