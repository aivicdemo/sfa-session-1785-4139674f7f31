import { calculateDataQualityScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-520: [edge] データ品質スコア算出機能 - 品質スコア計算時に端数が発生するとき四捨五入で丸められる
  test('品質スコアが複数の指標から計算され小数点第1位で四捨五入される', () => {
    const completenessScore = 85.3;
    const consistencyScore = 92.7;
    const accuracyScore = 78.4;

    const result = calculateDataQualityScore({
      completenessScore,
      consistencyScore,
      accuracyScore,
    });

    const expectedAverage = (completenessScore + consistencyScore + accuracyScore) / 3;
    const expectedRounded = Math.round(expectedAverage * 10) / 10;

    expect(result).toBe(85.5);
    expect(result).toEqual(expectedRounded);
    expect(typeof result).toBe('number');
    expect(result % 1).toBeLessThanOrEqual(1);
  });
});