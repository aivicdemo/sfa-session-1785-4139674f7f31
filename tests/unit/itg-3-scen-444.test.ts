import { calculateWeightedQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 品質スコア重み付け集計機能', () => {
  // SCEN-444
  test('複数のカテゴリスコアが0の場合、総合スコアが正しく加重平均される', () => {
    // 入力: 複数カテゴリスコア（品質、納期、コスト）で2つ以上が0
    const categoryScores = [80, 0, 60];
    const weights = [0.4, 0.35, 0.25];

    // 呼び出し
    const result = calculateWeightedQualityScore(categoryScores, weights);

    // 期待結果の計算:
    // 0以外のスコアと重み: 品質80(0.4), コスト60(0.25)
    // 加重平均 = (80 × 0.4 + 60 × 0.25) / (0.4 + 0.25)
    //         = (32 + 15) / 0.65
    //         = 47 / 0.65
    //         = 72.307...
    //         ≈ 72.31 (小数点第2位)
    const expectedScore = 72.31;

    // 戻り値の総合スコアを小数点第2位で比較
    expect(Math.round(result * 100) / 100).toBe(expectedScore);
  });
});