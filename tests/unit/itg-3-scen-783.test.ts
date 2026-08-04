import { evaluateRecommendationTrustworthiness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨信頼度スコア算出機能', () => {
  // SCEN-783
  test('過去成功パターンが1件のとき、信頼度スコアが正常に算出される', () => {
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        id: 'pattern_001',
        customerIndustry: '製造業',
        budgetSize: 5000000,
        decisionMaker: '経営層',
        successRate: 0.92,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn().mockReturnValue(0.85);

    const currentDealCondition = {
      customerIndustry: '製造業',
      budgetSize: 5000000,
      decisionMaker: '経営層',
    };

    const aiRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    const result = evaluateRecommendationTrustworthiness(
      currentDealCondition,
      aiRecommendationEngine
    );

    expect(result.trustScore).toBe(0.85);
    expect(result.scoreReasoning).toContain('過去成功パターン数: 1件');
    expect(result.scoreReasoning).toContain('パターン関連度: 0.85');
  });
});