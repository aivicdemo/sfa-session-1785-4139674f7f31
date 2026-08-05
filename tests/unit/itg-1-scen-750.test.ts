import { evaluateAiAgentInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-750
  test('[error] AIエージェント推論精度評価機能 - AIエージェント推論精度スコア算出時に営業管理職の権限情報が null のときエラーになる', () => {
    const input_manager_permission_info = null;
    const input_inference_results = [
      {
        inference_id: 'inf_001',
        predicted_value: 'pattern_A',
        actual_value: 'pattern_A',
        confidence_score: 0.95,
      },
      {
        inference_id: 'inf_002',
        predicted_value: 'pattern_B',
        actual_value: 'pattern_B',
        confidence_score: 0.88,
      },
    ];

    expect(() =>
      evaluateAiAgentInferenceAccuracy(
        input_manager_permission_info,
        input_inference_results
      )
    ).toThrow(/営業管理職の権限情報が未設定です/);

    try {
      evaluateAiAgentInferenceAccuracy(
        input_manager_permission_info,
        input_inference_results
      );
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error) {
        expect((error as any).code).toBe('ERR_PERMISSION_INFO_NULL');
      }
    }
  });
});