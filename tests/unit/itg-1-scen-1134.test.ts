import { calculateInferencePrecision } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1134
  test('推論結果の正解ラベルがnullのとき、精度計算がエラーになること', () => {
    const inference_result = {
      inference_id: 'INF-20240115-001',
      inference_value: '高優先度',
      correct_label: null,
    };

    expect(() => calculateInferencePrecision(inference_result)).toThrow(/正解ラベル/);
  });
});