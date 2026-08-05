import { calculateInferenceConfidenceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-730: AIエージェント推論精度評価機能 - 推論結果から信頼度スコア0～100で精度が算出される', () => {
    // Arrange: AIエージェントの推論結果をスタブとして用意
    const inference_result_1 = {
      predicted_value: 'proposal_accepted',
      confidence: 0.75,
      supporting_factors: 3,
      contradicting_factors: 1,
      data_completeness_score: 0.85,
    };

    const inference_result_2 = {
      predicted_value: 'follow_up_needed',
      confidence: 0.925,
      supporting_factors: 5,
      contradicting_factors: 0,
      data_completeness_score: 1.0,
    };

    const inference_result_3 = {
      predicted_value: 'risk_detected',
      confidence: 0.5,
      supporting_factors: 2,
      contradicting_factors: 2,
      data_completeness_score: 0.6,
    };

    // Act & Assert: 推論精度評価機能により信頼度スコアが算出される
    // ケース1: 推論結果の一致度75% → 信頼度スコア75
    const confidence_score_1 = calculateInferenceConfidenceScore(inference_result_1);
    expect(typeof confidence_score_1).toBe('number');
    expect(confidence_score_1).toBeGreaterThanOrEqual(0);
    expect(confidence_score_1).toBeLessThanOrEqual(100);
    expect(confidence_score_1).toBe(75);

    // ケース2: 推論結果の一致度92.5% → 信頼度スコア92.5
    const confidence_score_2 = calculateInferenceConfidenceScore(inference_result_2);
    expect(typeof confidence_score_2).toBe('number');
    expect(confidence_score_2).toBeGreaterThanOrEqual(0);
    expect(confidence_score_2).toBeLessThanOrEqual(100);
    expect(confidence_score_2).toBe(92.5);

    // ケース3: 推論結果の一致度50% → 信頼度スコア50
    const confidence_score_3 = calculateInferenceConfidenceScore(inference_result_3);
    expect(typeof confidence_score_3).toBe('number');
    expect(confidence_score_3).toBeGreaterThanOrEqual(0);
    expect(confidence_score_3).toBeLessThanOrEqual(100);
    expect(confidence_score_3).toBe(50);
  });
});