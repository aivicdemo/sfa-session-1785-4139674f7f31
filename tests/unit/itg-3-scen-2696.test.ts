import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック - 外部サービス呼び出し統合', () => {
  // SCEN-2696
  test('findSimilarPatternsが1件を返却し、evaluatePatternRelevanceで適用可能性スコア0.85以上のとき、推奨が適用対象として判定される', () => {
    const mockSimilarPattern = {
      patternId: 'PATTERN-001',
      similarity: 0.95,
      businessContext: '大規模企業向けSaaS提案',
      successRate: 0.87,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([mockSimilarPattern]),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      customerSize: 1000,
      industry: '金融',
      budgetAmount: 50000000,
    };

    const result = generateRecommendation(dealCondition, mockAIEngine);

    expect(result.isApplicable).toBe(true);
    expect(result.appliedPatternId).toBe('PATTERN-001');
    expect(result.relevanceScore).toBe(0.85);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      mockSimilarPattern,
      dealCondition
    );
  });
});