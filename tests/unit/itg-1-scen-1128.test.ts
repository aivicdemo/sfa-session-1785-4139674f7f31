import { monitorInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1128
  test('推論精度の監視サンプル件数が0のとき、エラーがスローされる', () => {
    const input = {
      sampleCount: 0,
      inferenceRecords: [],
    };

    expect(() => monitorInferenceAccuracy(input)).toThrow(/推論精度監視のサンプル件数が0件です。監視対象データが不足しています。/);
  });
});