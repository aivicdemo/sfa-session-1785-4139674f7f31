import { describe, test, expect } from "@jest/globals";
import { validateAlertThreshold } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1127
  test("アラート閾値が負の値のとき、処理がエラーになること", () => {
    const invalid_threshold = -0.5;

    expect(() => validateAlertThreshold(invalid_threshold)).toThrow(
      /INVALID_THRESHOLD_VALUE/
    );
  });
});