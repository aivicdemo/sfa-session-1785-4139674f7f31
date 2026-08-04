import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似パターン検索機能', () => {
  // SCEN-1151
  test('類似商談が複数件のとき、類似度スコアの高い順にソートして返却する', async () => {
    const currentDealCondition = {
      industry: '製造業',
      companySize: '大手企業',
      serviceType: 'クラウドサービス導入',
      budgetMin: 10000000,
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          dealId: 'DEAL-001',
          similarityScore: 0.95,
          dealContent: '大手製造業向けSaaS導入',
        },
        {
          dealId: 'DEAL-002',
          similarityScore: 0.78,
          dealContent: '中堅商社向けSaaS導入',
        },
        {
          dealId: 'DEAL-003',
          similarityScore: 0.88,
          dealContent: '大手流通業向けSaaS導入',
        },
      ]),
    };

    const result = await findSimilarPatterns(
      currentDealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      dealId: 'DEAL-001',
      similarityScore: 0.95,
      dealContent: '大手製造業向けSaaS導入',
    });
    expect(result[1]).toEqual({
      dealId: 'DEAL-003',
      similarityScore: 0.88,
      dealContent: '大手流通業向けSaaS導入',
    });
    expect(result[2]).toEqual({
      dealId: 'DEAL-002',
      similarityScore: 0.78,
      dealContent: '中堅商社向けSaaS導入',
    });
  });
});