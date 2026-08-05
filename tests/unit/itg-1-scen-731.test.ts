import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { evaluateAiAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-731: [normal] AIエージェント推論精度評価機能 - 営業担当者の提案内容分析が完了した状態での推論精度が正しく評価される
  test('営業担当者の提案内容分析完了後、推論精度が正しく評価される', () => {
    const analysis_completed_at = new Date('2024-01-15T10:30:00Z');
    const proposal_date = new Date('2024-01-15T09:00:00Z');

    const proposal_data = {
      proposal_date: proposal_date,
      product_name: '営業管理ツール',
      proposal_amount: 500000,
      customer_segment: '中堅企業',
      contract_prediction_score: 0.78,
      proposal_content: '顧客の営業プロセス効率化ニーズに対して、標準プロセステンプレートとAI分析機能を提案',
      customer_issue: '営業担当者間の成約率格差が20%',
      proposed_solution: 'AIエージェントによる行動分析と自動改善提案',
      follow_up_interval_days: 3,
      contact_frequency_per_month: 2,
      process_compliance_score: 0.85,
    };

    const analysis_result = {
      status: 'completed',
      analysis_completed_at: analysis_completed_at,
      analysis_duration_ms: 45000,
      data_quality_score: 0.92,
      pattern_match_count: 8,
      anomaly_detected: false,
    };

    const accuracy_evaluation = evaluateAiAgentInferenceAccuracy(
      proposal_data,
      analysis_result,
    );

    expect(accuracy_evaluation).toEqual(
      expect.objectContaining({
        accuracy_score: expect.any(Number),
        confidence_level: expect.stringMatching(/^(high|medium|low)$/),
        key_factors: expect.arrayContaining([expect.any(String)]),
        evaluation_timestamp: expect.any(String),
      }),
    );

    expect(accuracy_evaluation.accuracy_score).toBeGreaterThanOrEqual(0.0);
    expect(accuracy_evaluation.accuracy_score).toBeLessThanOrEqual(1.0);

    expect(['high', 'medium', 'low']).toContain(accuracy_evaluation.confidence_level);

    expect(accuracy_evaluation.key_factors).toHaveLength(expect.any(Number));
    expect(accuracy_evaluation.key_factors.length).toBeGreaterThanOrEqual(3);
    expect(accuracy_evaluation.key_factors.length).toBeLessThanOrEqual(5);

    const evaluation_ts = new Date(accuracy_evaluation.evaluation_timestamp);
    expect(evaluation_ts.getTime()).toBeGreaterThanOrEqual(analysis_completed_at.getTime());

    expect(typeof accuracy_evaluation.accuracy_score).toBe('number');
    expect(typeof accuracy_evaluation.confidence_level).toBe('string');
    expect(Array.isArray(accuracy_evaluation.key_factors)).toBe(true);
    expect(typeof accuracy_evaluation.evaluation_timestamp).toBe('string');
  });
});