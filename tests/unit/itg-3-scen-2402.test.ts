import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推論精度スコア算出機能', () => {
  test('SCEN-2402: [error] 新規案件の商談条件が空のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealWithEmptyCondition = {
      deal_id: 'DEAL-20240201-001',
      customer_id: 'CUST-12345',
      customer_industry: '製造業',
      customer_scale: '従業員数100-500',
      deal_condition: '',
      created_at: '2024-02-01T10:00:00Z',
    };

    expect(() =>
      evaluateRecommendationAccuracy(newDealWithEmptyCondition, mockAIEngine)
    ).toThrow(/商談条件/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});