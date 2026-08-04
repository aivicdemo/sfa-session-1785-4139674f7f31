import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-813: OpenAI API失敗時、根拠説明は簡略版が返却される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('OpenAI API connection failed')
    );
    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('OpenAI API timeout')
    );
    mockAIEngine.generateRecommendation.mockRejectedValueOnce(
      new Error('OpenAI API service unavailable')
    );

    const customerCondition = {
      customerName: 'ABC Corporation',
      industry: 'Manufacturing',
      budgetScale: 'Large',
      challenges: ['Cost reduction', 'Supply chain optimization'],
    };

    const dealCondition = {
      dealPhase: 'Initial discussion',
      productCategory: 'Enterprise software',
      expectedCloseDate: '2025-06-30',
    };

    const result = await generateRecommendation(
      customerCondition,
      dealCondition,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.recommendation).toBeDefined();
    expect(result.recommendation.patternId).toBe('PAT-0042');
    expect(result.recommendation.successCount).toBe(127);
    expect(result.recommendation.relevanceScore).toBe(0.94);

    expect(result.reasoning).toBeDefined();
    expect(result.reasoning.patternId).toBe('PAT-0042');
    expect(result.reasoning.pastSuccessCount).toBe(127);
    expect(result.reasoning.applicabilityScore).toBe(0.94);

    expect(result.reasoning.detailedExplanation).toBeUndefined();
    expect(result.reasoning.naturalLanguageExplanation).toBeUndefined();

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);

    const firstCall = mockAIEngine.generateRecommendation.mock.calls[0];
    const secondCall = mockAIEngine.generateRecommendation.mock.calls[1];
    const thirdCall = mockAIEngine.generateRecommendation.mock.calls[2];

    expect(firstCall).toEqual([customerCondition, dealCondition]);
    expect(secondCall).toEqual([customerCondition, dealCondition]);
    expect(thirdCall).toEqual([customerCondition, dealCondition]);

    expect(result.source).toBe('fallback_pattern_master');
    expect(result.isSimplifiedReasoning).toBe(true);
  });
});