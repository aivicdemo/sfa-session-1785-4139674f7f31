import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-457
  test('[normal] AIエージェント推論精度が閾値以下の場合、アラートが発生する', () => {
    const accuracyThreshold = 70;
    const currentAccuracy = 65;
    const alertLevel = 'high';
    const expectedMessage = 'AIエージェント推論精度が閾値以下です。現在精度：65%、閾値：70%';
    const beforeExecutionTime = new Date('2024-01-15T11:00:00Z');
    const executionTime = new Date('2024-01-15T11:00:01Z');
    const afterExecutionTime = new Date('2024-01-15T11:00:02Z');

    const mockInferenceResult = {
      accuracy: currentAccuracy,
      timestamp: executionTime.toISOString(),
    };

    const mockAlertNotifications: Array<{
      level: string;
      message: string;
      timestamp: string;
    }> = [];

    const mockAlertSystem = {
      notify: (level: string, message: string, timestamp: string) => {
        mockAlertNotifications.push({
          level,
          message,
          timestamp,
        });
      },
    };

    const result = monitorInferenceAccuracy({
      accuracyThreshold,
      currentInferenceResult: mockInferenceResult,
      alertNotificationSystem: mockAlertSystem,
      monitoringTime: executionTime,
    });

    expect(result.alertTriggered).toBe(true);
    expect(result.alertLevel).toBe(alertLevel);
    expect(result.alertMessage).toContain(expectedMessage);
    expect(mockAlertNotifications).toHaveLength(1);
    expect(mockAlertNotifications[0].level).toBe(alertLevel);
    expect(mockAlertNotifications[0].message).toContain(expectedMessage);

    const alertTimestamp = new Date(mockAlertNotifications[0].timestamp);
    expect(alertTimestamp.getTime()).toBeGreaterThanOrEqual(
      beforeExecutionTime.getTime()
    );
    expect(alertTimestamp.getTime()).toBeLessThanOrEqual(
      afterExecutionTime.getTime()
    );
  });
});