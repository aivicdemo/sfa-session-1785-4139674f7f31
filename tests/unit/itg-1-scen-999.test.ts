import { calculateConfidenceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-999: [edge] 成功要因・失敗要因の抽出と承認基準判定機能 - 信頼度スコアの計算結果に小数点以下の端数が生じるとき規定の丸め方式で処理される
  test('信頼度スコアが小数点以下第2位で規定の丸め方式に従い処理される', () => {
    const successFactorData = {
      successCaseCount: 7,
      failureCaseCount: 3,
      importantMetricAchievementRate: 0.856,
    };

    const failureFactorData = {
      failurePatternDetectionCount: 2,
      riskIndicatorValue: 0.421,
    };

    const result = calculateConfidenceScore({
      successFactorData,
      failureFactorData,
      roundingMethod: 'ROUND_HALF_UP',
    });

    expect(result.confidenceScore).toBe(68.57);
    expect(result.roundedPrecision).toBe(2);
    expect(typeof result.confidenceScore).toBe('number');
  });
});