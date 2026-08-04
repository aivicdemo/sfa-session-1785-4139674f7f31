import { displayRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1935
  test('根拠データのスコアが欠落しているときに表示処理がスキップされる', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: undefined,
        relevantPatterns: []
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: 'test explanation'
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn()
    };

    const reasoningDataWithMissingScore = {
      recommendationId: 'rec-001',
      customerId: 'cust-001',
      dealId: 'deal-001',
      patterns: [
        {
          patternId: 'pat-001',
          patternName: 'similar_case_1',
          score: null,
          matchedAttributes: ['industry', 'company_size'],
          successRate: 0.85
        }
      ],
      rootCause: [],
      suggestedApproach: 'standard_proposal'
    };

    const result = displayRecommendationReasoning(
      reasoningDataWithMissingScore,
      mockAIEngine
    );

    expect(result).toEqual({
      displayed: false,
      skippedReason: 'missing_score',
      reasoningOutput: null,
      explainCalled: false
    });

    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});