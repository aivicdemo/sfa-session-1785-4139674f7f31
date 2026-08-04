import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンの適用可能性評価機能', () => {
  test('SCEN-249: 成功パターンIDが null のとき、評価処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn((patternId: string | null, dealConditions: unknown) => {
        if (patternId === null) {
          const error = new Error('patternId is required');
          (error as any).statusCode = 400;
          throw error;
        }
        return { score: 85, isApplicable: true };
      }),
    };

    const newDealConditions = {
      customerId: 'CUST-001',
      dealAmount: 5000000,
      industry: 'manufacturing',
    };

    expect(() => {
      evaluatePatternRelevance(null, newDealConditions, mockAIRecommendationEngine);
    }).toThrow(/patternId|成功パターンID/);
  });
});