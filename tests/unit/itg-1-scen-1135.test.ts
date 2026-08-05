import { monitorAIInferenceAccuracyAndAlert } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1135
  test('[error] アラート履歴への記録が失敗したとき、処理がエラーになること', async () => {
    const inference_log_id = 'log_12345';
    const inference_accuracy_score = 85;
    const accuracy_threshold = 90;
    const alert_message = '推論精度が閾値を下回っています';
    const timestamp = new Date('2024-01-15T11:00:00Z');

    const mockAlertHistoryStore = {
      save: jest.fn().mockRejectedValueOnce(
        new Error('Connection timeout during alert history write')
      ),
    };

    const mockInferenceLogStore = {
      findById: jest.fn().mockResolvedValueOnce({
        inference_log_id,
        accuracy_score: inference_accuracy_score,
        created_at: timestamp,
      }),
    };

    const mockAlertSettingStore = {
      findThresholdByType: jest.fn().mockResolvedValueOnce({
        threshold_value: accuracy_threshold,
        alert_type: 'INFERENCE_ACCURACY',
      }),
    };

    await expect(
      monitorAIInferenceAccuracyAndAlert(
        {
          inference_log_id,
          inference_accuracy_score,
          accuracy_threshold,
          alert_message,
          timestamp,
        },
        {
          alertHistoryStore: mockAlertHistoryStore,
          inferenceLogStore: mockInferenceLogStore,
          alertSettingStore: mockAlertSettingStore,
        }
      )
    ).rejects.toThrow(/アラート記録失敗|ALERT_LOG_WRITE_FAILED/);
  });
});