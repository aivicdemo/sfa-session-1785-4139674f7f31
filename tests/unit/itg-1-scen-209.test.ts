import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-209
  test('乖離度の計算に小数点第3位以上の端数が発生する場合、指定の丸め方法で処理される', () => {
    // テストデータ: 基準値100に対して実績値33.333...（端数が無限に続く場合）
    const benchmark_value = 100;
    const actual_value = 33.333333;

    // 期待値: 四捨五入により小数点第2位までに丸められる
    // (100 - 33.333333) / 100 * 100 = 66.666667
    // 四捨五入で小数点第2位: 66.67
    const expected_deviation_score = 66.67;

    const result = calculateDeviationScore({
      benchmark_value,
      actual_value,
      rounding_method: 'round',
    });

    expect(result).toBe(expected_deviation_score);
  });
});