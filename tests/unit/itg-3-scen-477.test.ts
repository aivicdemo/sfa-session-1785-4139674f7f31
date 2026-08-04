import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出機能', () => {
  // SCEN-477
  test('データ品質ルール適用件数が 0 のとき、エラーが発生する', () => {
    const input = {
      ruleApplyCount: 0,
      passCount: 0,
      totalCheckCount: 100,
    };

    expect(() => calculateDataQualityScore(input)).toThrow(/ルール適用件数/);
  });
});