import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  // SCEN-872
  test('適用可能性評価結果が昇順で入力されたとき信頼度スコアが正しく算出される', () => {
    const relevanceScores = [0.2, 0.4, 0.6, 0.8];
    
    const result = evaluatePatternRelevance(relevanceScores);
    
    const expectedConfidenceScore = 0.5;
    expect(result.confidenceScore).toBe(expectedConfidenceScore);
    expect(typeof result.confidenceScore).toBe('number');
    expect(result.confidenceScore).toBeCloseTo(expectedConfidenceScore, 2);
    expect(result.evaluatedScores).toEqual(relevanceScores);
  });
});