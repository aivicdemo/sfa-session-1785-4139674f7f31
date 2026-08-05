import { monitorAiAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-483
  test('[error] アラート設定が欠落している場合、エラーを返す', () => {
    const task_id = 'task_20240115_001';
    const inference_accuracy = 0.75;
    const alert_config = undefined;

    expect(() =>
      monitorAiAgentInferenceAccuracy({
        task_id,
        inference_accuracy,
        alert_config,
      })
    ).toThrow(/アラート設定/);
  });
});