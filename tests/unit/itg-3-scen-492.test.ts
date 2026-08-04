import { calculateDataQualityReportPriority } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-492
  test('改善優先度ランク算出機能 - 実装難易度が0から100の範囲外のときエラーが発生する', () => {
    const baseParams = {
      dataQualityScore: 75,
      completenessScore: 80,
      accuracyScore: 85,
      consistencyScore: 90,
      implementationDifficulty: -1,
    };

    expect(() =>
      calculateDataQualityReportPriority(baseParams)
    ).toThrow(/実装難易度は0から100の範囲内/);

    const paramsExceedingMax = {
      ...baseParams,
      implementationDifficulty: 101,
    };

    expect(() =>
      calculateDataQualityReportPriority(paramsExceedingMax)
    ).toThrow(/実装難易度は0から100の範囲内/);
  });
});