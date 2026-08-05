import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-734
  test('同一の推論結果に対して複数回精度評価を実行しても同じスコアが算出される', () => {
    const inference_result = {
      inference_id: 'INFER-001',
      inference_content: '顧客A向け提案戦略は営業段階フェーズ2で実行推奨',
      inference_timestamp: new Date('2024-01-15T10:30:00Z'),
      model_version: '1.0',
      confidence_score: 0.92,
    };

    const scope1 = evaluateInferenceAccuracy(inference_result);
    const scope2 = evaluateInferenceAccuracy(inference_result);
    const scope3 = evaluateInferenceAccuracy(inference_result);

    expect(scope1).toBe(0.87);
    expect(scope2).toBe(0.87);
    expect(scope3).toBe(0.87);
    expect(scope1).toEqual(scope2);
    expect(scope2).toEqual(scope3);
  });
});