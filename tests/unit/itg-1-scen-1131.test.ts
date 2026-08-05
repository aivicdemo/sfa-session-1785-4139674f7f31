import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1131
  test("監視対象期間の終了日時が欠落しているとき、処理がエラーになること", () => {
    const { monitorAiInferencePrecision } = require("../../src/logic/it-1-br-2-1-1-1");

    const monitoring_start_datetime = new Date("2024-01-01T00:00:00Z");
    const monitoring_end_datetime = null;
    const inference_accuracy_threshold = 95;

    expect(() => {
      monitorAiInferencePrecision({
        monitoring_start_datetime,
        monitoring_end_datetime,
        inference_accuracy_threshold,
      });
    }).toThrow(/終了日時/);
  });
});