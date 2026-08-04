import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨信頼度スコア算出機能', () => {
  test('SCEN-869: 過去成功パターン件数が1件のとき信頼度スコアが正しく算出される', () => {
    const similarPatterns = [
      {
        matchDegreeScore: 0.85,
        successRate: 0.92,
        applicabilityScore: 0.88,
      },
    ];

    const patternRelevanceScore = 0.88;

    const result = evaluatePatternRelevance(
      similarPatterns,
      patternRelevanceScore,
    );

    const expectedConfidenceScore =
      (0.85 + 0.88) / 2;

    expect(result).toBe(expectedConfidenceScore);
  });
});