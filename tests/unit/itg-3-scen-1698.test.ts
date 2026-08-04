import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1698
  test('提案アプローチが null のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposedApproach: null,
        confidence: 0,
        reasoning: 'test'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const input = {
      customerId: 'CUST001',
      customerIndustry: 'IT',
      customerSize: 'large',
      dealStage: 'proposal',
      dealAmount: 500000,
      dealTimeline: 30,
      aiEngine: mockAIEngine
    };

    expect(() => generateRecommendation(input)).toThrow(/提案アプローチ/);
  });
});