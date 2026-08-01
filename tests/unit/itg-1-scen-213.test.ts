import { jest } from "@jest/globals";
import {
  initializeAIAgentInferenceMonitoring,
  setInferenceAccuracyThreshold,
  analyzeSellingEmployeeBehaviorPattern,
  getInferenceAccuracyMonitoringLog,
} from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-213
  test("AIエージェント推論精度が低下している場合、推論精度監視ログに警告が記録される", () => {
    // Arrange
    const mockCurrentTime = new Date("2024-01-15T11:00:00Z");
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentTime);

    const thresholdPercentage = 70;
    const actualAccuracyPercentage = 60;
    const employeeId = "EMP-001";
    const analysisDate = "2024-01-15";

    initializeAIAgentInferenceMonitoring();
    setInferenceAccuracyThreshold(thresholdPercentage);

    // Stub: AIエージェント推論精度を60%に設定
    jest.spyOn(global as any, "Math").mockImplementation(() => ({
      random: jest.fn(() => actualAccuracyPercentage / 100),
    }));

    // Act
    analyzeSellingEmployeeBehaviorPattern({
      employeeId,
      analysisDate,
      inferenceAccuracy: actualAccuracyPercentage,
    });

    const monitoringLogs = getInferenceAccuracyMonitoringLog();

    // Assert
    expect(monitoringLogs).toBeDefined();
    expect(monitoringLogs.length).toBeGreaterThan(0);

    const warningLog = monitoringLogs.find(
      (log: any) => log.logLevel === "WARNING"
    );
    expect(warningLog).toBeDefined();

    expect(warningLog.message).toBe(
      "AIエージェント推論精度が閾値以下に低下しています"
    );
    expect(warningLog.inferenceAccuracy).toBe(60);
    expect(warningLog.status).toBe("alert_triggered");

    const logTimestamp = new Date(warningLog.timestamp);
    const timeDifferenceSeconds = Math.abs(
      (logTimestamp.getTime() - mockCurrentTime.getTime()) / 1000
    );
    expect(timeDifferenceSeconds).toBeLessThanOrEqual(5);

    jest.useRealTimers();
  });
});