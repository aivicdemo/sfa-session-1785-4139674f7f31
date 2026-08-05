import { calculateInferenceAccuracyAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度監視 - 精度閾値直下時のアラート非発生', () => {
  test('SCEN-925: 推論精度が監視閾値直下（74.9%）のときアラートが発生しない', () => {
    // Arrange: 監視閾値を75%に設定、推論精度を74.9%に設定したスタブ
    const monitoring_threshold_percent = 75;
    const current_inference_accuracy_percent = 74.9;
    const inference_id = 'inf_test_925_001';
    const check_timestamp = new Date('2024-01-15T10:30:00Z');
    const system_log_records: string[] = [];

    // 簡易的なログ記録スタブ
    const log_stub = (message: string) => {
      system_log_records.push(message);
    };

    // Act: 精度チェック処理を実行
    const alert_result = calculateInferenceAccuracyAlert(
      {
        inference_id,
        current_accuracy_percent: current_inference_accuracy_percent,
        threshold_percent: monitoring_threshold_percent,
        checked_at: check_timestamp,
      },
      log_stub
    );

    // Assert: アラート生成ロジックが呼び出されず、アラートが発生していないこと
    expect(alert_result.alert_triggered).toBe(false);
    expect(alert_result.alert_event).toBeNull();

    // システムログに『推論精度74.9%は閾値75%以下のため監視対象外』というメッセージが記録されることを検証
    const log_message_found = system_log_records.some(
      (log_msg) =>
        log_msg.includes('74.9') &&
        log_msg.includes('75') &&
        (log_msg.includes('監視対象外') ||
          log_msg.includes('below threshold') ||
          log_msg.includes('not monitored'))
    );
    expect(log_message_found).toBe(true);
  });
});