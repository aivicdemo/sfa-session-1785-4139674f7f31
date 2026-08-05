import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-513: [edge] AIエージェント推論精度の自動監視とアラート機能 - 推論精度が閾値95%未満の94.99%の場合にアラートが発生する
  test("推論精度94.99%が閾値95%未満の場合、アラート通知が発火される", () => {
    const alertThreshold = 95;
    const currentAccuracy = 94.99;
    const alertCallbackMock = jest.fn();

    monitorInferenceAccuracy({
      threshold: alertThreshold,
      currentAccuracy: currentAccuracy,
      onAlertTriggered: alertCallbackMock,
    });

    expect(alertCallbackMock).toHaveBeenCalledTimes(1);
    expect(alertCallbackMock).toHaveBeenCalledWith({
      message: "推論精度が閾値95%を下回りました。現在の精度: 94.99%",
      severity: "warning",
    });
  });
});