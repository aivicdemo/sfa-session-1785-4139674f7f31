import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-2758: 適用可能な成功パターンが複数件並ぶとき、信頼度スコアの高い順に根拠が表示される', () => {
    // Arrange: AIRecommendationEngineのスタブ設定
    const mockSuccessPatternA = {
      patternId: 'pattern_a',
      name: 'パターンA',
      confidenceScore: 0.92,
      description: 'Large enterprise cross-sell approach'
    };

    const mockSuccessPatternB = {
      patternId: 'pattern_b',
      name: 'パターンB',
      confidenceScore: 0.78,
      description: 'Mid-market upsell approach'
    };

    const mockSuccessPatternC = {
      patternId: 'pattern_c',
      name: 'パターンC',
      confidenceScore: 0.85,
      description: 'SMB renewal approach'
    };

    const mockSimilarPatternsResponse = [
      mockSuccessPatternA,
      mockSuccessPatternB,
      mockSuccessPatternC
    ];

    const mockRelevanceScoresResponse = {
      pattern_a: 0.92,
      pattern_b: 0.78,
      pattern_c: 0.85
    };

    const stubAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatternsResponse),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(mockRelevanceScoresResponse),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn()
    };

    const newCaseSalesCondition = {
      customerId: 'cust_12345',
      customerIndustry: 'manufacturing',
      customerSize: 'large_enterprise',
      dealStage: 'qualification',
      dealValue: 500000,
      productCategory: 'enterprise_software',
      dealConditions: {
        budget: 500000,
        decisionTimeline: 90,
        requiredFeatures: ['automation', 'analytics', 'reporting']
      }
    };

    // Act: generateRecommendationを呼び出し、内部でfindSimilarPatternsとevaluatePatternRelevanceを呼び出させる
    const recommendationResult = generateRecommendation(
      newCaseSalesCondition,
      stubAIRecommendationEngine
    );

    // Assert: 推奨内容の根拠表示が信頼度スコア降順で表示されることを検証
    expect(recommendationResult).toBeDefined();
    expect(recommendationResult.recommendationContent).toBeDefined();
    expect(recommendationResult.reasoningBasis).toBeDefined();

    const reasoningPatterns = recommendationResult.reasoningBasis.supportingPatterns;
    expect(reasoningPatterns.length).toBe(3);

    // 信頼度スコア降順の検証: 0.92 → 0.85 → 0.78
    expect(reasoningPatterns[0].confidenceScore).toBe(0.92);
    expect(reasoningPatterns[0].patternId).toBe('pattern_a');
    expect(reasoningPatterns[0].name).toBe('パターンA');

    expect(reasoningPatterns[1].confidenceScore).toBe(0.85);
    expect(reasoningPatterns[1].patternId).toBe('pattern_c');
    expect(reasoningPatterns[1].name).toBe('パターンC');

    expect(reasoningPatterns[2].confidenceScore).toBe(0.78);
    expect(reasoningPatterns[2].patternId).toBe('pattern_b');
    expect(reasoningPatterns[2].name).toBe('パターンB');

    // 各パターンに信頼度スコア値を含む説明文が表示されることを検証
    expect(reasoningPatterns[0].explanation).toContain('0.92');
    expect(reasoningPatterns[1].explanation).toContain('0.85');
    expect(reasoningPatterns[2].explanation).toContain('0.78');

    // スタブが正しく呼び出されたことを検証
    expect(stubAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        customerIndustry: 'manufacturing',
        customerSize: 'large_enterprise',
        dealStage: 'qualification'
      })
    );

    expect(stubAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});