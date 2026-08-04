import { findSimilarPatterns, generateRecommendation, explainRecommendationReasoning } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨ロジック - 外部サービス呼び出し失敗時の代替動作', () => {
  // SCEN-2695
  test('findSimilarPatterns が空配列を返却したとき、推奨パターンマスタからの統計上位パターンが返却される', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: 'manufacturing',
      budgetRange: 'mid-level',
      issueCategory: 'supply-chain-optimization',
      dealStage: 'discovery',
      customerScale: 'mid-market',
    };

    const similarPatternsResult = await mockAIEngine.findSimilarPatterns(dealCondition);
    expect(similarPatternsResult).toEqual([]);

    const recommendationResult = await generateRecommendation(
      dealCondition,
      mockAIEngine,
    );

    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.sourceType).toBe('fallback_pattern_master');
    expect(recommendationResult.patterns).toBeDefined();
    expect(Array.isArray(recommendationResult.patterns)).toBe(true);
    expect(recommendationResult.patterns.length).toBeGreaterThan(0);
    expect(recommendationResult.confidenceScore).toBeLessThanOrEqual(70);

    const reasoningResult = await explainRecommendationReasoning(
      recommendationResult,
      mockAIEngine,
    );

    expect(reasoningResult).toBeDefined();
    expect(reasoningResult.explanation).toBeDefined();
    expect(reasoningResult.isSimplified).toBe(true);
    expect(reasoningResult.explanation.length).toBeGreaterThan(0);
    expect(reasoningResult.sourceIndicator).toBe('master_data_fallback');
  });
});