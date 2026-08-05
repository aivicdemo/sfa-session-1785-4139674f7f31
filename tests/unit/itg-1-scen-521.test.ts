import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-521: [edge] AIエージェント推論精度の自動監視とアラート機能 - 同一精度閾値のアラート設定が重複なく監視対象に含まれる
  it('should prevent duplicate alert settings with same accuracy threshold from being added to monitoring targets', async () => {
    const { registerAlertSettingForAccuracyMonitoring, getMonitoredAlertSettings } = await import('../../src/logic/it-1-br-2-1-1-1');

    const alert_setting_id_1 = 'alert_setting_001';
    const alert_setting_id_2 = 'alert_setting_002';
    const accuracy_threshold_percentage = 80;
    const monitoring_target_id = 'monitoring_target_ai_001';

    // Step 1: Register first alert setting with accuracy threshold 80%
    const first_registration_result = await registerAlertSettingForAccuracyMonitoring({
      alert_setting_id: alert_setting_id_1,
      monitoring_target_id: monitoring_target_id,
      accuracy_threshold_percentage: accuracy_threshold_percentage,
      alert_name: 'AI Inference Accuracy Alert 1',
      severity_level: 'HIGH',
    });
    expect(first_registration_result.success).toBe(true);
    expect(first_registration_result.alert_setting_id).toBe(alert_setting_id_1);

    // Step 2: Attempt to register second alert setting with same accuracy threshold 80%
    const second_registration_result = await registerAlertSettingForAccuracyMonitoring({
      alert_setting_id: alert_setting_id_2,
      monitoring_target_id: monitoring_target_id,
      accuracy_threshold_percentage: accuracy_threshold_percentage,
      alert_name: 'AI Inference Accuracy Alert 2',
      severity_level: 'MEDIUM',
    });

    // Step 3: Retrieve monitored alert settings for the monitoring target
    const monitored_alerts = await getMonitoredAlertSettings({
      monitoring_target_id: monitoring_target_id,
    });

    // Step 4: Count alert settings with accuracy threshold 80%
    const matching_alerts = monitored_alerts.alert_settings.filter(
      (alert) => alert.accuracy_threshold_percentage === accuracy_threshold_percentage,
    );
    const duplicate_count = matching_alerts.length;

    // Expected result: Only 1 alert setting with accuracy threshold 80% should be present
    // No duplicates should exist in the monitoring targets
    expect(duplicate_count).toBe(1);
    expect(second_registration_result.success).toBe(false);
    expect(second_registration_result.error_code).toBe('DUPLICATE_THRESHOLD');
    expect(monitored_alerts.alert_settings.length).toBeGreaterThanOrEqual(1);
    expect(
      monitored_alerts.alert_settings.some(
        (alert) => alert.alert_setting_id === alert_setting_id_1 && alert.accuracy_threshold_percentage === 80,
      ),
    ).toBe(true);
  });
});