import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('Past Deal Success Pattern Extraction and Recommendation', () => {
  // SCEN-207
  test('should return top-ranked internal pattern recommendation when external AI call fails and deal conditions are empty', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('API timeout')), 100);
        });
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealInput = {
      customerId: null,
      customerName: '',
      industry: null,
      companySize: null,
      dealAmount: null,
      dealStage: '',
      proposalContent: '',
      customerNeedDescription: '',
    };

    const result = await generateRecommendation(newDealInput, mockAIEngine);

    expect(result).toEqual({
      recommendationId: expect.any(String),
      status: 'fallback',
      userMessage: '推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します',
      recommendations: [
        {
          rank: 1,
          patternName: '標準提案パターン',
          successRate: 0.72,
          applicableFrequency: 145,
          proposalApproach: '顧客課題の段階的ヒアリングと段階的提案',
          reasoning: '内部統計データより',
          confidenceScore: 0,
        },
        {
          rank: 2,
          patternName: '経営層向け価値提案パターン',
          successRate: 0.68,
          applicableFrequency: 98,
          proposalApproach: 'ROI/投資対効果を中心とした説得資料',
          reasoning: '内部統計データより',
          confidenceScore: 0,
        },
        {
          rank: 3,
          patternName: '業務効率化提案パターン',
          successRate: 0.65,
          applicableFrequency: 72,
          proposalApproach: 'プロセス最適化と自動化による効率化メリット提案',
          reasoning: '内部統計データより',
          confidenceScore: 0,
        },
      ],
      fallbackReason: 'external_ai_timeout',
      internalPatternSource: true,
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newDealInput);
  });
});