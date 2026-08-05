import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  monitorInferenceAccuracy,
} from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1162: [edge] AIエージェント推論精度の自動監視とアラート機能 - 推論精度が監視閾値直下（例：84.9%）のときアラートが発生される
  it('推論精度84.9%で閾値85%直下のとき、警告アラートが生成され通知先に送信される', () => {
    // Arrange: テストデータ準備
    const accuracyThreshold = 85;
    const currentAccuracy = 84.9;
    const alertType = '推論精度低下警告';
    const severity = 'WARNING';
    const expectedMessage = `推論精度が閾値以下です。現在値: ${currentAccuracy}%、閾値: ${accuracyThreshold}%`;
    const notificationChannels = ['email', 'system_notification'];

    const monitoringConfig = {
      accuracyThreshold: accuracyThreshold,
      notificationChannels: notificationChannels,
    };

    const inferenceResult = {
      accuracy: currentAccuracy,
      timestamp: new Date('2024-01-15T11:00:00Z'),
      inferenceId: 'inference_001',
    };

    // Act: 監視機能を実行
    const result = monitorInferenceAccuracy(monitoringConfig, inferenceResult);

    // Assert: アラート生成と通知を検証
    expect(result).toBeDefined();
    expect(result.alertGenerated).toBe(true);
    expect(result.alerts).toHaveLength(1);

    const generatedAlert = result.alerts[0];
    expect(generatedAlert.type).toBe(alertType);
    expect(generatedAlert.severity).toBe(severity);
    expect(generatedAlert.message).toBe(expectedMessage);
    expect(generatedAlert.accuracy).toBe(currentAccuracy);
    expect(generatedAlert.threshold).toBe(accuracyThreshold);
    expect(generatedAlert.notificationsSent).toHaveLength(2);
    expect(generatedAlert.notificationsSent).toContain('email');
    expect(generatedAlert.notificationsSent).toContain('system_notification');
    expect(generatedAlert.timestamp).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(generatedAlert.inferenceId).toBe('inference_001');
  });
});