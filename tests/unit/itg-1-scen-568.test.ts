import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-568
  test('推論ログの推論精度が0未満の場合、エラーになる', () => {
    const inferenceLogData = {
      inference_log_id: 'log-001',
      agent_id: 'agent-123',
      inference_accuracy: -0.5,
      execution_timestamp: new Date('2024-11-15T10:30:00Z'),
      input_data: { customer_id: 'cust-456', sales_stage: 'proposal' },
      output_result: { recommendation: 'follow_up', confidence: 0.75 },
      performance_metrics: { latency_ms: 250, memory_usage_mb: 128 },
    };

    expect(() => validateInferenceAccuracy(inferenceLogData)).toThrow(
      /INVALID_INFERENCE_ACCURACY/
    );

    try {
      validateInferenceAccuracy(inferenceLogData);
    } catch (error: any) {
      expect(error.code).toBe('INVALID_INFERENCE_ACCURACY');
      expect(error.message).toBe(
        '推論精度は0以上1以下の値である必要があります'
      );
    }
  });
});