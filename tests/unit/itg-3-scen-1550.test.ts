import { proposeApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1550
  test('新規案件の商談条件が欠けている場合、提案アプローチ推奨処理は実行されず空結果が返却される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealWithMissingIndustry = {
      customerId: 'CUST-001',
      customerName: 'Test Company',
      industry: null,
      budgetScale: 'medium',
      implementationPeriod: '2024-Q2',
      dealValue: 500000,
    };

    const result = proposeApproach(dealWithMissingIndustry, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});