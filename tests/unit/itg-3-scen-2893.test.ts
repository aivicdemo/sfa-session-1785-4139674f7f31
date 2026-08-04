import { evaluateRecommendationConformity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-2893
  test('標準プロセスとの乖離度が許容閾値を超過したときに適合性が低と判定される', () => {
    const standard_process = {
      required_touchpoints: 5,
      days_to_first_followup: 3,
      required_confirmation_items: 3,
    };

    const threshold_value = 30;
    const deviation_score = 45;

    const ai_engine_stub = {
      evaluatePatternRelevance: jest.fn(() => ({
        deviation_score: deviation_score,
        standard_touchpoints: standard_process.required_touchpoints,
        standard_days: standard_process.days_to_first_followup,
        standard_items: standard_process.required_confirmation_items,
      })),
    };

    const recommendation_data = {
      proposal_content: '提案内容A',
      recommended_timing: '2024-02-15',
      touchpoint_count: 7,
      followup_days: 5,
      confirmation_items: ['項目1', '項目2'],
    };

    const result = evaluateRecommendationConformity(
      recommendation_data,
      standard_process,
      threshold_value,
      ai_engine_stub
    );

    expect(result.conformityLevel).toBe('LOW');
    expect(result.deviationScore).toBe(45);
    expect(result.exceedsThreshold).toBe(true);
    expect(result.thresholdValue).toBe(30);
    expect(result.reasoningText).toMatch(/標準プロセスとの乖離度が許容範囲を超えています/);
  });
});