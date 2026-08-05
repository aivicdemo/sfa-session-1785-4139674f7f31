import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockLogger: { logs: Array<{ timestamp: string; accuracy: number; decision: string }> };

  beforeEach(() => {
    mockLogger = { logs: [] };
  });

  afterEach(() => {
    mockLogger.logs = [];
  });

  // SCEN-591: [edge] 推論精度が監視閾値直上（閾値+0.01%）である場合
  test('推論精度95.01%は閾値95.00%を超過し、アラート未発行・正常範囲内と判定される', () => {
    const threshold_percent = 95.00;
    const inference_accuracy_percent = 95.01;
    const expected_alert_generated = false;
    const expected_decision = '閾値超過・正常';
    const expected_logged_accuracy = 95.01;

    const result = evaluateInferenceAccuracy({
      threshold_percent,
      inference_accuracy_percent,
      logger: mockLogger
    });

    expect(result.alert_generated).toBe(expected_alert_generated);
    expect(result.decision).toBe(expected_decision);
    expect(result.accuracy_logged).toBe(expected_logged_accuracy);

    expect(mockLogger.logs).toHaveLength(1);
    const log_entry = mockLogger.logs[0];
    expect(log_entry.accuracy).toBe(expected_logged_accuracy);
    expect(log_entry.decision).toBe(expected_decision);
  });
});