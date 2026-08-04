import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質改善優先度判定', () => {
  // SCEN-484
  test('改善優先度ランク算出機能 - 改善対象項目リストが null のときエラーをスロー', () => {
    expect(() => {
      calculateImprovementPriorityRank({
        improvementItems: null,
        dataQualityScore: 75,
        improvementMetrics: []
      });
    }).toThrow(/改善対象項目リスト/);
  });
});