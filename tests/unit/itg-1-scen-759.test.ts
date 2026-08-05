import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-759
  test('推論精度スコア算出時に正解ラベルが未設定のときエラーになる', () => {
    const inferenceResults = [
      {
        predicted_label: 'success',
        confidence_score: 0.95,
        correct_label: undefined,
        inference_id: 'inf_001',
      },
      {
        predicted_label: 'success',
        confidence_score: 0.90,
        correct_label: undefined,
        inference_id: 'inf_002',
      },
      {
        predicted_label: 'failure',
        confidence_score: 0.85,
        correct_label: undefined,
        inference_id: 'inf_003',
      },
      {
        predicted_label: 'success',
        confidence_score: 0.88,
        correct_label: undefined,
        inference_id: 'inf_004',
      },
      {
        predicted_label: 'failure',
        confidence_score: 0.80,
        correct_label: undefined,
        inference_id: 'inf_005',
      },
    ];

    expect(() => {
      calculateInferenceAccuracy(inferenceResults);
    }).toThrow(/正解ラベル/);
  });
});