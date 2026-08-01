import { calculateAIInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-469
  test('推論精度の監視対象外の項目がある場合、その項目を除外して精度計算される', () => {
    const monitoredItems = [
      'customer_satisfaction_score',
      'proposal_content_validity',
      'deal_progress_forecast'
    ];

    const excludedItems = [
      'system_response_time'
    ];

    const accuracyResults = {
      customer_satisfaction_score: 88,
      proposal_content_validity: 92,
      deal_progress_forecast: 85,
      system_response_time: 78
    };

    const result = calculateAIInferenceAccuracy({
      monitored_items: monitoredItems,
      excluded_items: excludedItems,
      item_accuracy_percentages: accuracyResults,
      sample_size: 30
    });

    expect(result.overall_accuracy).toBe(88.33);
    expect(result.included_items).toEqual([
      'customer_satisfaction_score',
      'proposal_content_validity',
      'deal_progress_forecast'
    ]);
    expect(result.excluded_items).toEqual([
      'system_response_time'
    ]);
    expect(result.calculation_details).toEqual({
      numerator: 265,
      denominator: 3,
      formula: '(88 + 92 + 85) / 3'
    });
  });
});