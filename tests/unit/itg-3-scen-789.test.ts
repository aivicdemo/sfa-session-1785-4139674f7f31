import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  // SCEN-789
  test('マッチング類似度スコアが入力されないとき、信頼度は基準スコアのみで算出される', () => {
    const baseScore = 75;
    const matchingSimilarityScore = undefined;

    const result = evaluatePatternRelevance({
      baseScore,
      matchingSimilarityScore,
    });

    expect(result).toBe(75);
  });
});