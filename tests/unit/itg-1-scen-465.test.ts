import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-465
  test('推論精度の計算値が小数点以下の端数を含む場合、正しく計算される', () => {
    const correctCount = 67;
    const totalCount = 200;

    const result = calculateInferenceAccuracy(correctCount, totalCount);

    expect(typeof result).toBe('number');
    expect(result).toBe(33.5);
  });
});