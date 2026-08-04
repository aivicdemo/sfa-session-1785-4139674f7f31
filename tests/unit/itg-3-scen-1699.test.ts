import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1699
  test('提案アプローチが空文字列のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      companySize: 'large',
      dealAmount: 5000000,
      dealStage: 'proposal',
      proposedApproach: '',
      pastSuccessPatterns: [
        {
          patternId: 'PAT-001',
          customerIndustry: 'IT',
          customerSize: 'large',
          dealAmount: 4500000,
          successRate: 0.85,
          proposalApproach: 'コスト削減',
        },
      ],
    };

    expect(() => {
      generateRecommendation(input, mockAIEngine);
    }).toThrow(/提案アプローチは必須項目です/);

    try {
      generateRecommendation(input, mockAIEngine);
    } catch (error) {
      expect((error as any).code).toBe('ERR_EMPTY_PROPOSED_APPROACH');
      expect((error as any).name).toBe('ValidationError');
    }
  });
});