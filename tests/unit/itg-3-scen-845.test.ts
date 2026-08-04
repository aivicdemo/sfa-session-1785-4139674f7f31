import { generateRecommendationWithConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の信頼度スコア算出・根拠提示機能', () => {
  test('SCEN-845: 提案アプローチデータが空文字列のとき、バリデーションエラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      proposalApproach: '',
      dealConditions: {
        industry: 'technology',
        companySize: 'medium',
        budget: 5000000,
        timeline: '2024-03-31',
      },
      aiEngine: mockAIEngine,
    };

    expect(() =>
      generateRecommendationWithConfidenceScore(input)
    ).toThrow(/提案アプローチデータ/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});