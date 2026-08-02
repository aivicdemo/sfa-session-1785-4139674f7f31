import { recordDuplicateJudgmentResult } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データの重複・不整合検出と正規化ルール適用による統合判定機能', () => {
  // SCEN-171
  test('統合判定履歴に判定結果（重複/非重複）が記録される', () => {
    const customer_a_id = 'cust_001';
    const customer_b_id = 'cust_002';
    const judgment_result = '重複';
    const recorded_at = new Date('2024-01-15T10:30:00Z');
    const test_execution_time = new Date('2024-01-15T10:30:00Z');

    const result = recordDuplicateJudgmentResult({
      customer_a_id,
      customer_b_id,
      judgment_result,
      recorded_at,
    });

    expect(result).toEqual({
      judgment_history_id: expect.any(String),
      customer_a_id,
      customer_b_id,
      judgment_result,
      recorded_at: expect.any(Date),
      is_recorded: true,
    });

    expect(result.is_recorded).toBe(true);
    expect(result.judgment_result).toBe('重複');
    expect(result.customer_a_id).toBe('cust_001');
    expect(result.customer_b_id).toBe('cust_002');

    const time_diff = Math.abs(
      result.recorded_at.getTime() - test_execution_time.getTime()
    );
    expect(time_diff).toBeLessThanOrEqual(5000);
  });
});