import { monitorAiInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-694: アラート対象ユーザーIDが null のとき通知送信がエラーになる", () => {
    const mockNotificationService = {
      send: jest.fn(),
    };

    const mockLogger = {
      error: jest.fn(),
    };

    const alertConfig = {
      userId: null,
      thresholdAccuracy: 80,
      notificationService: mockNotificationService,
      logger: mockLogger,
    };

    const inferenceData = {
      accuracy: 75,
      timestamp: new Date("2024-01-15T11:00:00Z"),
      modelVersion: "v1.0",
    };

    expect(() => {
      monitorAiInferenceAccuracy(alertConfig, inferenceData);
    }).toThrow(/アラート対象ユーザーID/);

    expect(mockNotificationService.send).not.toHaveBeenCalled();

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/ALERT_NOTIFICATION_FAILED.*userId is null/)
    );
  });
});