import { calculateInferenceAccuracy } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-518
  test('推論精度の計算で小数点以下が発生した場合に指定の丸め方で処理される', () => {
    const rawAccuracyScore = 87.6543;

    // ①小数点第2位四捨五入の場合
    const roundingConfig_RoundHalfUp = { type: 'round', decimalPlaces: 2 };
    const result_RoundHalfUp = calculateInferenceAccuracy({
      rawScore: rawAccuracyScore,
      rounding: roundingConfig_RoundHalfUp,
    });
    expect(result_RoundHalfUp.accuracyScore).toBe(87.65);

    // ②小数点第1位切り捨ての場合
    const roundingConfig_FloorFirstDecimal = { type: 'floor', decimalPlaces: 1 };
    const result_FloorFirstDecimal = calculateInferenceAccuracy({
      rawScore: rawAccuracyScore,
      rounding: roundingConfig_FloorFirstDecimal,
    });
    expect(result_FloorFirstDecimal.accuracyScore).toBe(87.6);

    // ③小数点第2位切り上げの場合
    const roundingConfig_CeilSecondDecimal = { type: 'ceil', decimalPlaces: 2 };
    const result_CeilSecondDecimal = calculateInferenceAccuracy({
      rawScore: rawAccuracyScore,
      rounding: roundingConfig_CeilSecondDecimal,
    });
    expect(result_CeilSecondDecimal.accuracyScore).toBe(87.66);
  });
});