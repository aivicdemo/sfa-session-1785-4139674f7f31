import { calculateCorrelationIndex } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-180
  test('成約率が0%の場合、相関指数が計算不可として記録される', () => {
    const input = {
      sales_person_id: 'SP001',
      contact_count: 5,
      deal_count: 0,
      deal_amount: 0,
      process_adherence_score: 75,
      follow_up_frequency: 2,
      proposal_accuracy: 0.6
    };

    const result = calculateCorrelationIndex(input);

    expect(result.correlation_index_status).toBe('計算不可');
    expect(result.correlation_index_value).toBeNull();
    expect(result.guidance_target_determination).toBe('対象外');
  });
});