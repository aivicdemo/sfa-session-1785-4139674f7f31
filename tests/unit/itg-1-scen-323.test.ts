import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-323
  test('[normal] AIエージェント推論精度監視機能 - AIエージェント推論ログが複数件の場合に全件から精度が計算される', () => {
    const inference_logs = [
      {
        inference_id: 'inf_001',
        agent_id: 'agent_alpha',
        timestamp: new Date('2024-01-15T09:00:00Z'),
        input_data: { customer_id: 'cust_001', proposal_content: 'proposal_A' },
        output_result: 'recommended',
        is_correct: true,
        confidence_score: 0.92,
      },
      {
        inference_id: 'inf_002',
        agent_id: 'agent_alpha',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        input_data: { customer_id: 'cust_002', proposal_content: 'proposal_B' },
        output_result: 'not_recommended',
        is_correct: true,
        confidence_score: 0.88,
      },
      {
        inference_id: 'inf_003',
        agent_id: 'agent_alpha',
        timestamp: new Date('2024-01-15T12:00:00Z'),
        input_data: { customer_id: 'cust_003', proposal_content: 'proposal_C' },
        output_result: 'recommended',
        is_correct: false,
        confidence_score: 0.75,
      },
    ];

    const result = calculateInferenceAccuracy({ inference_logs });

    expect(result.accuracy_percentage).toBe(66.67);
    expect(result.correct_count).toBe(2);
    expect(result.total_count).toBe(3);
    expect(result.display_text).toBe('推論精度: 66.67%（2/3）');
    expect(result.target_log_count).toBe(3);
  });
});