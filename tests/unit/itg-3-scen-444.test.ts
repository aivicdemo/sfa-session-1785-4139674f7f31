import { calculateWeightedQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 品質スコア重み付け集計機能', () => {
  // SCEN-444
  test('複数のカテゴリスコアが0の場合、総合スコアが正しく加重平均される', () => {
    // 入力: カテゴリスコア配列（品質80、納期0、コスト60）
    const categoryScores = [80, 0, 60];
    
    // 入力: 重み付け係数配列（品質0.4、納期0.35、コスト0.25）
    const weights = [0.4, 0.35, 0.25];
    
    // 期待値の計算
    // 0以外のスコア: 品質80（重み0.4）、コスト60（重み0.25）
    // 加重合計 = 80 * 0.4 + 60 * 0.25 = 32 + 15 = 47
    // 有効な重みの合計 = 0.4 + 0.25 = 0.65
    // 総合スコア = 47 / 0.65 = 72.307... ≈ 72.31（小数点第2位で四捨五入）
    const expectedScore = 72.31;
    
    // 関数呼び出し
    const result = calculateWeightedQualityScore(categoryScores, weights);
    
    // 検証: 小数点第2位で比較
    expect(Math.round(result * 100) / 100).toBe(expectedScore);
  });
});