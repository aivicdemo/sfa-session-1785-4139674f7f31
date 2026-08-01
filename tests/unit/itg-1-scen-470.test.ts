import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import { monitorInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-470
  test("アラート設定が未定義の場合、推論精度の自動監視が実行されない", () => {
    const alert_config = undefined;
    const external_service_url = "https://alert-service.example.com/notify";
    const log_messages: string[] = [];

    const original_console_log = console.log;
    console.log = (message: string) => {
      log_messages.push(message);
    };

    try {
      const result = monitorInferenceAccuracy({
        alert_config: alert_config,
        external_service_url: external_service_url,
      });

      expect(result.monitoring_executed).toBe(false);
      expect(result.external_notification_count).toBe(0);
      expect(fetchMock.calls()).toHaveLength(0);
      expect(log_messages.some((msg) =>
        /Alert configuration is not defined/.test(msg)
      )).toBe(true);
    } finally {
      console.log = original_console_log;
    }
  });
});