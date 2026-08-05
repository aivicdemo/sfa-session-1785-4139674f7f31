import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  test('SCEN-953: 影響度と発生頻度の積が上限値を超過したとき、スコアは上限値にクリップされる', () => {
    // 初期条件: 上限値を1000に設定
    const max_score_limit = 1000;

    // 入力: 影響度50、発生頻度25（積: 1250 > 1000）
    const impact_degree = 50;
    const occurrence_frequency = 25;

    // 期待値の計算
    // 影響度 × 発生頻度 = 50 × 25 = 1250
    // 1250 > 1000（上限値）なので、上限値1000にクリップされる
    const expected_clipped_score = 1000;

    // 改善優先度スコア算出関数を実行
    const actual_score = calculateImprovementPriorityScore(
      impact_degree,
      occurrence_frequency,
      max_score_limit
    );

    // 算出結果がスコア上限値にクリップされていることを検証
    expect(actual_score).toBe(expected_clipped_score);
  });
});