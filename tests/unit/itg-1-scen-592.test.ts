import { calculateInferenceAccuracy, generateAccuracyAlert } from '../../src/logic/it-1-br-2-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-592
  test('推論精度計算で無限小数が発生する場合（2件正解/3件推論）の精度計算とアラート生成', () => {
    // 初期化: テストデータの準備
    const correctCount = 2;
    const totalInferenceCount = 3;
    const accuracyThreshold = 0.65;

    // 推論精度計算ロジックの実行
    const calculatedAccuracy = calculateInferenceAccuracy(
      correctCount,
      totalInferenceCount
    );

    // 期待値: 2 ÷ 3 = 0.6666666666666666
    const expectedAccuracy = 0.6666666666666666;

    // 計算結果の値と型をアサーション
    expect(calculatedAccuracy).toBe(expectedAccuracy);
    expect(typeof calculatedAccuracy).toBe('number');

    // 計算結果が有限数であることを検証（NaN、Infinity は除外）
    expect(isFinite(calculatedAccuracy)).toBe(true);
    expect(Number.isNaN(calculatedAccuracy)).toBe(false);

    // アラート閾値判定ロジックへの入力
    const alertResult = generateAccuracyAlert(
      calculatedAccuracy,
      accuracyThreshold
    );

    // アラート生成の有無と通知内容をアサーション
    // 精度 0.6666... は閾値 0.65 を上回るため WARNING レベルのアラート生成を期待
    expect(alertResult.alertGenerated).toBe(true);
    expect(alertResult.alertLevel).toBe('WARNING');
    expect(alertResult.actualAccuracy).toBe(expectedAccuracy);
    expect(alertResult.threshold).toBe(accuracyThreshold);
    expect(typeof alertResult.message).toBe('string');
  });
});