import { describe, test, expect, beforeEach } from '@jest/globals';
import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-427
  test('推論精度が閾値より低い場合、アラートが発生する', () => {
    const threshold_percent = 70;
    const actual_accuracy_percent = 65;
    const ai_agent_id = 'agent-001';
    const inference_timestamp = new Date('2024-01-15T11:00:00Z');

    const alert_result = monitorInferenceAccuracy({
      ai_agent_id: ai_agent_id,
      inference_accuracy_percent: actual_accuracy_percent,
      threshold_percent: threshold_percent,
      inference_timestamp: inference_timestamp,
    });

    expect(alert_result).toEqual({
      alert_generated: true,
      alert_type: '推論精度低下',
      severity_level: 'WARNING',
      ai_agent_id: ai_agent_id,
      alert_timestamp: inference_timestamp,
      accuracy_percent: actual_accuracy_percent,
    });
  });
});