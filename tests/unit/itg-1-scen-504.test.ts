import { calculateInferenceAccuracyScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-504
  test('[normal] AIエージェント推論精度スコア算出機能 - 推論結果と実績データの比較において、順序が逆の場合でも精度スコアが正しく算出される', () => {
    const inference_result = {
      inference_datetime: '2024-01-15T10:00:00Z',
      inference_content: [
        { element_name: 'contract_forecast', element_value: 'high' },
        { element_name: 'order_amount', element_value: '5000000' }
      ]
    };

    const actual_result = {
      actual_datetime: '2024-01-20T15:30:00Z',
      actual_content: [
        { element_name: 'order_amount', element_value: '5000000' },
        { element_name: 'contract_forecast', element_value: 'high' }
      ]
    };

    const normal_order_score = calculateInferenceAccuracyScore(
      inference_result,
      actual_result
    );

    const reversed_order_score = calculateInferenceAccuracyScore(
      actual_result,
      inference_result
    );

    expect(normal_order_score).toBe(0.95);
    expect(reversed_order_score).toBe(0.95);
    expect(normal_order_score).toEqual(reversed_order_score);
  });
});