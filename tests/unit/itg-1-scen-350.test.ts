import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  monitorInferenceAccuracy,
  MonitorInferenceAccuracyInput,
  MonitorInferenceAccuracyOutput,
} from "../../src/logic/it-1-br-2-1-1-1";

const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

describe("AIエージェント推論精度自動監視機能 - データベース接続エラーハンドリング", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-350
  test("推論精度監視データベースへの接続が失敗したとき、エラーが発生する", async () => {
    // Arrange: 推論精度監視データベースへの接続をシミュレートするスタブを、接続失敗を返すようにモック設定
    fetchMock.mockRejectOnce(new Error("Connection refused"));

    const input: MonitorInferenceAccuracyInput = {
      agentId: "agent-001",
      monitoringPeriodStartDate: new Date("2024-01-15T00:00:00Z"),
      monitoringPeriodEndDate: new Date("2024-01-15T23:59:59Z"),
      accuracyThresholdPercent: 95,
    };

    // Act & Assert: AIエージェント推論精度自動監視機能の初期化処理を実行し、推論精度監視データベースへの接続を試みる
    try {
      await monitorInferenceAccuracy(input);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: unknown) {
      // Assert: エラーオブジェクトが返され、エラーコード『DB_CONNECTION_FAILED』を含む
      const errorObj = error as Record<string, unknown>;
      expect(errorObj).toHaveProperty("code");
      expect(errorObj.code).toBe("DB_CONNECTION_FAILED");

      // Assert: エラーメッセージ『推論精度監視データベースへの接続に失敗しました』を含む
      expect(errorObj).toHaveProperty("message");
      expect(String(errorObj.message)).toMatch(/推論精度監視データベース/);
      expect(String(errorObj.message)).toMatch(/接続に失敗/);

      // Assert: システムのステータスは『error』に更新される
      expect(errorObj).toHaveProperty("status");
      expect(errorObj.status).toBe("error");
    }
  });
});