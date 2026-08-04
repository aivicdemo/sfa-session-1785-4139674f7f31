import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン照合機能 - 降順ランク付け', () => {
  // SCEN-907
  test('過去成功パターンが昇順で照合されたとき降順に再ランク付けされる', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          relevanceScore: 0.65,
          successCaseCount: 8,
          applicableIndustries: ['金融', '医療'],
          patternDescription: '低リスク長期提案パターン'
        },
        {
          patternId: 'PAT-002',
          relevanceScore: 0.72,
          successCaseCount: 12,
          applicableIndustries: ['SaaS', '小売'],
          patternDescription: '中期導入パターン'
        },
        {
          patternId: 'PAT-003',
          relevanceScore: 0.89,
          successCaseCount: 24,
          applicableIndustries: ['SaaS', '製造'],
          patternDescription: '高速展開パターン'
        }
      ])
    };

    const newDealData = {
      customerIndustry: 'SaaS',
      dealStage: '初期提案',
      budgetRange: '1000万円以上',
      dealId: 'DEAL-2024-001',
      customerId: 'CUST-5678'
    };

    const result = await findSimilarPatterns(newDealData, mockAIRecommendationEngine);

    expect(result).toHaveLength(3);
    expect(result[0].relevanceScore).toBe(0.89);
    expect(result[0].patternId).toBe('PAT-003');
    expect(result[0].successCaseCount).toBe(24);
    expect(result[0].applicableIndustries).toEqual(['SaaS', '製造']);

    expect(result[1].relevanceScore).toBe(0.72);
    expect(result[1].patternId).toBe('PAT-002');
    expect(result[1].successCaseCount).toBe(12);
    expect(result[1].applicableIndustries).toEqual(['SaaS', '小売']);

    expect(result[2].relevanceScore).toBe(0.65);
    expect(result[2].patternId).toBe('PAT-001');
    expect(result[2].successCaseCount).toBe(8);
    expect(result[2].applicableIndustries).toEqual(['金融', '医療']);
  });
});