import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能', () => {
  test('SCEN-1293: OpenAI APIが正常応答した場合に推奨パターンと根拠が返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRecommendationResponse = {
      recommendedPattern: '初期接触時に技術デモンストレーションを優先提案する',
      reasoning: '過去同業種案件でデモ提案後の提案承認率が78%',
      confidenceScore: 0.78,
      isApplicable: true,
    };

    mockAIEngine.findSimilarPatterns.mockResolvedValue({
      patterns: [
        {
          id: 'pattern_001',
          pattern: mockRecommendationResponse.recommendedPattern,
          reasoning: mockRecommendationResponse.reasoning,
          confidenceScore: mockRecommendationResponse.confidenceScore,
          isApplicable: mockRecommendationResponse.isApplicable,
          successRate: 0.78,
          sampleSize: 50,
          industry: 'IT',
          dealStage: 'pre-proposal',
          budgetRange: 'above_5M',
        },
      ],
      totalMatches: 1,
      executionTime: 1200,
    });

    const newDealInput = {
      customerIndustry: 'IT企業',
      dealStage: '提案前',
      budgetSize: '500万円以上',
      customerId: 'cust_12345',
      dealId: 'deal_67890',
    };

    const result = await findSimilarPatterns(newDealInput, mockAIEngine);

    expect(result).toBeDefined();
    expect(result.patterns).toHaveLength(1);

    const firstPattern = result.patterns[0];
    expect(firstPattern.pattern).toBe('初期接触時に技術デモンストレーションを優先提案する');
    expect(firstPattern.reasoning).toBe('過去同業種案件でデモ提案後の提案承認率が78%');
    expect(firstPattern.confidenceScore).toBe(0.78);
    expect(firstPattern.isApplicable).toBe(true);
    expect(typeof firstPattern.confidenceScore).toBe('number');
    expect(firstPattern.confidenceScore).toBeGreaterThanOrEqual(0.0);
    expect(firstPattern.confidenceScore).toBeLessThanOrEqual(1.0);
  });
});