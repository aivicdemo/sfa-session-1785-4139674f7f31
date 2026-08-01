import { validateAIInferenceReadiness } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論実行前の学習データ量・品質検証機能', () => {
  // SCEN-096
  test('営業活動ログの品質スコアが良好ライン直下の場合、推論実行が保留される', () => {
    const sales_activity_log_id = 'log_001';
    const quality_score = 69;
    const quality_threshold = 70;
    const sales_activity_log = {
      id: sales_activity_log_id,
      quality_score: quality_score,
      sales_rep_id: 'rep_001',
      activity_type: 'visit',
      customer_id: 'cust_001',
      recorded_at: new Date('2024-01-15T10:30:00Z'),
    };

    const result = validateAIInferenceReadiness({
      sales_activity_logs: [sales_activity_log],
      quality_threshold: quality_threshold,
      minimum_data_volume: 10,
      current_data_volume: 15,
    });

    expect(result.status).toBe('PENDING');
    expect(result.can_execute_inference).toBe(false);
    expect(result.hold_reason).toMatch(/営業活動ログの品質スコアが良好ライン/);
    expect(result.hold_reason).toMatch(/69点/);
    expect(result.hold_reason).toMatch(/70点/);
  });
});