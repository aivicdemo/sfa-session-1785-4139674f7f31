import { validateAiAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-570
  test('推論精度監視データの推論精度が欠落している場合、エラーになる', () => {
    const inference_precision_monitoring_data_without_accuracy = {
      id: 'mon-001',
      ai_agent_inference_log_id: 'log-001',
      inference_accuracy_score: null,
      monitoring_timestamp: '2024-01-15T10:30:00Z',
      alert_triggered: false,
    };

    expect(() =>
      validateAiAgentInferenceAccuracy(
        inference_precision_monitoring_data_without_accuracy
      )
    ).toThrow(/推論精度が欠落/);
  });
});