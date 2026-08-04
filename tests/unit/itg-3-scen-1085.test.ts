import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-1085
  test('新規案件の商談条件オブジェクトが null のとき、推奨生成処理がエラーになる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社テスト',
      industry: 'IT',
      companySize: 'large',
      dealConditions: null,
      proposalContent: '基幹システム構築提案',
    };

    expect(() =>
      generateRecommendation(newDealData, mockAIRecommendationEngine)
    ).toThrow(/dealConditions|商談条件/);
  });
});