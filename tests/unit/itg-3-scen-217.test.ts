import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 成功パターン抽出と提案アプローチ推奨', () => {
  // SCEN-217
  test('新規案件の商談条件がnullのとき、推奨処理がエラーになる', () => {
    const newDealData = {
      dealId: 'DEAL-001',
      customerId: 'CUST-001',
      customerName: '新規顧客A',
      industry: 'IT',
      companySize: 'large',
      dealConditions: null,
      dealStatus: 'initial',
      proposalAmount: 5000000,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      generateRecommendation(newDealData, mockAIEngine);
    }).toThrow(/商談条件/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});