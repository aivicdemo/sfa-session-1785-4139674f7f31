import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('AIエージェント推論精度監視 - 推論精度スコア算出エラーハンドリング', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-754
  test('提案内容の正当性検証失敗時にPROPOSAL_VALIDATION_FAILEDエラーが返却される', async () => {
    const { calculateInferenceAccuracyScore } = await import('../../src/logic/it-1-br-2-1-1-1');

    const input = {
      inference_log_id: 'log-20240115-001',
      proposal_content: {
        product_id: 'prod-123',
        customer_id: 'cust-456',
        proposed_value: 50000,
        approach_type: 'consultative',
      },
      validation_stub: {
        should_fail: true,
        error_reason: 'invalid_constraint_match',
      },
    };

    let caught_error: any = null;
    try {
      await calculateInferenceAccuracyScore(input);
    } catch (err) {
      caught_error = err;
    }

    expect(caught_error).toBeDefined();
    expect(caught_error.code).toBe('PROPOSAL_VALIDATION_FAILED');
    expect(caught_error.message).toMatch(/提案内容の正当性検証に失敗しました/);
  });
});