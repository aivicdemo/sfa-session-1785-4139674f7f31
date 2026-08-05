import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1044
  test('推論精度が100を超える値のとき推論精度監視がエラーになること', () => {
    const invalidInferenceAccuracy = 100.5;

    const result = monitorInferenceAccuracy({
      inferenceAccuracy: invalidInferenceAccuracy,
    });

    expect(result.status).toBe('ERROR');
    expect(result.errorMessage).toMatch(/推論精度は0から100の範囲内である必要があります/);
  });
});