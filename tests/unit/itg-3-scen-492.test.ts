import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出', () => {
  // SCEN-492
  test('実装難易度が0から100の範囲外のときエラーが発生する', () => {
    const validDataQualityScore = 75;
    const validImprovement = 50;

    const outOfRangeNegative = -1;
    expect(() =>
      calculateImprovementPriorityRank(
        validDataQualityScore,
        validImprovement,
        outOfRangeNegative,
      ),
    ).toThrow(/実装難易度は0から100の範囲内/);

    const outOfRangeExceeded = 101;
    expect(() =>
      calculateImprovementPriorityRank(
        validDataQualityScore,
        validImprovement,
        outOfRangeExceeded,
      ),
    ).toThrow(/実装難易度は0から100の範囲内/);
  });
});