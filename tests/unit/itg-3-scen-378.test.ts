import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度検証機能 - 推論精度が設定閾値ちょうどのとき', () => {
  test('SCEN-378: 推論精度が80%（設定閾値80%）のとき、閾値達成判定が成功', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(80.0),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const input_threshold_percentage = 80.0;
    const input_current_accuracy_score = 80.0;
    const expected_result_status = 'threshold_achieved';
    const expected_result_threshold_met = true;
    const expected_log_contains_accuracy = 'スコア: 80.0';
    const expected_log_contains_threshold = '閾値: 80.0';
    const expected_log_contains_judgment = '判定結果: 達成';

    // Act
    const result = evaluateInferenceAccuracy(
      {
        threshold_percentage: input_threshold_percentage,
        ai_engine: mockAIRecommendationEngine,
        current_accuracy_score: input_current_accuracy_score,
      }
    );

    // Assert
    expect(result.threshold_met).toBe(expected_result_threshold_met);
    expect(result.status).toBe(expected_log_contains_judgment);
    expect(result.accuracy_score).toBe(input_current_accuracy_score);
    expect(result.threshold).toBe(input_threshold_percentage);
    expect(result.recommendation_status).toBe(expected_result_status);
    expect(result.internal_log).toMatch(/精度/);
    expect(result.internal_log).toContain(expected_log_contains_accuracy);
    expect(result.internal_log).toContain(expected_log_contains_threshold);
    expect(result.internal_log).toContain(expected_log_contains_judgment);
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});