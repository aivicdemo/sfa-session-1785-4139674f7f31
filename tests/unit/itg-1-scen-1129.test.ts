import { setAlertConfig } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1129
  test('アラート設定のユーザーIDが欠落しているとき、エラーコードMISSING_USER_IDが返されること', () => {
    const alert_config_missing_user_id = {
      user_id: null,
      alert_name: 'inference_precision_threshold',
      threshold: 0.85,
      condition_type: 'below_threshold',
      metric_type: 'inference_accuracy',
      enabled: true,
      created_at: new Date('2024-01-15T10:00:00Z'),
    };

    const result = setAlertConfig(alert_config_missing_user_id);

    expect(result.error_code).toBe('MISSING_USER_ID');
    expect(result.error_message).toMatch(/ユーザーID/);
    expect(result.error_message).toMatch(/必須項目/);
    expect(result.is_saved).toBe(false);
    expect(result.config_id).toBeUndefined();
  });
});