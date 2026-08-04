import { evaluateDataQualityScoreAndRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-417
  test('スコア80点の場合、正しい改善優先度ランクが付与される', () => {
    const completeness = 80;
    const accuracy = 80;
    const consistency = 80;
    const timeliness = 80;

    const expectedScore = 80.0;
    const expectedRank = 'C';

    const result = evaluateDataQualityScoreAndRank({
      completeness,
      accuracy,
      consistency,
      timeliness,
    });

    expect(result.score).toBe(expectedScore);
    expect(result.rank).toBe(expectedRank);
  });
});