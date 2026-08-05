import { calculateAiInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-744
  test('顧客対応パターン分析結果が null のときエラーが返される', () => {
    const input = {
      customer_response_pattern_analysis_result: null,
      proposal_content_analysis_score: 85,
      process_compliance_score: 90,
      success_pattern_match_score: 88
    };

    const result = calculateAiInferenceAccuracyScore(input);

    expect(result.error_code).toBe('INVALID_ANALYSIS_RESULT');
    expect(result.error_message).toBe('顧客対応パターン分析結果が取得できません');
    expect(result.accuracy_score).toBeUndefined();
  });
});