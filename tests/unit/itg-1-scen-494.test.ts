import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-494: AIエージェント推論精度スコア算出機能 - 推論対象の営業担当者提案内容が1件の場合、精度スコアが正常に算出される', () => {
    const proposal_input = {
      proposal_id: 'PROP-20240115-001',
      proposal_datetime: new Date('2024-01-15T11:00:00Z'),
      proposal_content: '顧客のニーズに基づいた標準的な商品提案',
      proposal_amount: 500000,
      salesperson_id: 'SALES-0001',
      customer_id: 'CUST-0001',
      is_approved: true,
      proposal_success_flag: 1,
    };

    const inference_result = {
      inference_id: 'INF-20240115-001',
      proposal_id: proposal_input.proposal_id,
      inference_score: 85.5,
      inference_datetime: new Date('2024-01-15T11:05:00Z'),
      inference_status: 'COMPLETED',
    };

    const scoring_rule = {
      rule_id: 'RULE-001',
      base_score: 100,
      deduction_per_deviation: 5,
      max_score: 100,
      min_score: 0,
    };

    const accuracy_score_result = calculateInferenceAccuracyScore([proposal_input], [inference_result], scoring_rule);

    expect(accuracy_score_result.accuracy_score).toBe(85.50);
    expect(accuracy_score_result.sample_count).toBe(1);
    expect(accuracy_score_result.accuracy_score).toBeGreaterThanOrEqual(0);
    expect(accuracy_score_result.accuracy_score).toBeLessThanOrEqual(100);
  });
});