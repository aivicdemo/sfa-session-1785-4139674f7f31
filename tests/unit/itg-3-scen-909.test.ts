import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-909
  test('[edge] 成功パターン照合機能 - 過去成功パターンに重複を含むとき照合で重複分が排除される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          industry: '製造業',
          product: 'ERP導入',
          successFactor: '経営層への事前説明',
          successRate: 0.85,
          matchScore: 0.92,
        },
        {
          industry: '製造業',
          product: 'ERP導入',
          successFactor: '経営層への事前説明',
          successRate: 0.85,
          matchScore: 0.92,
        },
      ]),
    };

    const newCustomerInfo = {
      industry: '製造業',
      employeeCount: 500,
      challenge: '業務効率化',
    };

    const result = findSimilarPatterns(newCustomerInfo, mockAIRecommendationEngine);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      industry: '製造業',
      product: 'ERP導入',
      successFactor: '経営層への事前説明',
      successRate: 0.85,
      matchScore: 0.92,
    });
  });
});