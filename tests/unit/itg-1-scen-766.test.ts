import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-766
  test('営業担当者の行動パターン分析対象データが1件のとき、精度スコアが正しく算出される', () => {
    const single_activity_record = {
      activity_id: 'ACT-20240115-001',
      salesperson_id: 'SP-0001',
      customer_id: 'CUST-0001',
      activity_type: 'visit',
      contact_count: 1,
      proposal_submitted: 1,
      follow_up_conducted: 0,
      activity_date: '2024-01-15T09:30:00Z',
      duration_minutes: 45,
      outcome_rating: 0.8
    };

    const analysis_input = {
      activity_records: [single_activity_record],
      salesperson_id: 'SP-0001',
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
      weighting_config: {
        visit_weight: 0.3,
        proposal_weight: 0.4,
        follow_up_weight: 0.3
      }
    };

    const result = evaluateInferenceAccuracy(analysis_input);

    expect(result).toBeDefined();
    expect(typeof result.inference_accuracy_score).toBe('number');
    expect(result.inference_accuracy_score).toBeGreaterThanOrEqual(0.0);
    expect(result.inference_accuracy_score).toBeLessThanOrEqual(1.0);
    
    const expected_accuracy_score = (1 * 0.3 + 1 * 0.4 + 0 * 0.3) / 3;
    expect(result.inference_accuracy_score).toBe(expected_accuracy_score);

    expect(result.metadata).toBeDefined();
    expect(result.metadata.data_point_count).toBe(1);
    expect(result.metadata.analysis_item_count).toBe(3);
    expect(result.metadata.salesperson_id).toBe('SP-0001');
    expect(result.metadata.analysis_period_start).toBe('2024-01-01');
    expect(result.metadata.analysis_period_end).toBe('2024-01-31');

    expect(result.calculation_basis).toBeDefined();
    expect(result.calculation_basis.weighted_items).toEqual([
      { item_name: 'visit_engagement', weight: 0.3, score: 1, contribution: 0.3 },
      { item_name: 'proposal_submission', weight: 0.4, score: 1, contribution: 0.4 },
      { item_name: 'follow_up_execution', weight: 0.3, score: 0, contribution: 0.0 }
    ]);

    expect(result.calculation_basis.total_weighted_sum).toBe(0.7);
    expect(result.calculation_basis.total_weight).toBe(1.0);
  });
});