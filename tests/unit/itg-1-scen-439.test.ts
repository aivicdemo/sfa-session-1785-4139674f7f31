import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-439
  test('推論精度の計算で端数が発生する場合、浮動小数点数として正確に保持される', () => {
    const correct_count = 67;
    const total_count = 300;

    const result = calculateInferenceAccuracy({
      correct_count,
      total_count,
    });

    expect(typeof result).toBe('number');
    
    const expected_accuracy = 0.2233333333;
    expect(result).toBeCloseTo(expected_accuracy, 10);
    
    expect(result).toBeGreaterThanOrEqual(0.22);
  });
});