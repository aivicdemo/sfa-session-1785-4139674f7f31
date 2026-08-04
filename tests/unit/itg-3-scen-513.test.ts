import { validateDataQualityPriority } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質検証', () => {
  // SCEN-513
  test('スコアが0に近いのに改善優先度がランク3のとき、整合性検証エラーが発生する', () => {
    const data_quality_score = 0.05;
    const improvement_priority_rank = 3;

    expect(() =>
      validateDataQualityPriority(data_quality_score, improvement_priority_rank)
    ).toThrow(/データ品質スコア.*矛盾/);
  });
});