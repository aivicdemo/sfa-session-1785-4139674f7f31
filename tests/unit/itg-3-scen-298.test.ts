import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し新規案件に適用する機能', () => {
  // SCEN-298
  test('類似パターン検索・ランク付け機能 - 検索対象の過去商談データが直近100件ちょうどのとき、すべてがランク付け対象になる', async () => {
    const mockPastDealData = Array.from({ length: 100 }, (_, index) => ({
      dealId: `deal_${String(index + 1).padStart(3, '0')}`,
      productCategory: index % 3 === 0 ? 'Software' : index % 3 === 1 ? 'Service' : 'Support',
      customerIndustry: index % 4 === 0 ? 'Manufacturing' : index % 4 === 1 ? 'Finance' : index % 4 === 2 ? 'Retail' : 'Healthcare',
      contractAmount: 50000 + (index * 1000),
      contractedFlag: index % 2 === 0,
    }));

    const mockSimilarityScores = mockPastDealData.map((deal, index) => ({
      dealId: deal.dealId,
      similarityScore: 0.5 + (Math.random() * 0.5),
      productCategory: deal.productCategory,
      customerIndustry: deal.customerIndustry,
      contractAmount: deal.contractAmount,
    }));

    const sortedResults = mockSimilarityScores.sort((a, b) => b.similarityScore - a.similarityScore);

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(sortedResults),
    };

    const searchCondition = {
      customerIndustry: 'Manufacturing',
      budgetRange: { min: 100000, max: 500000 },
      productCategory: 'Software',
    };

    const result = await findSimilarPatterns(searchCondition, mockAIEngine);

    expect(result).toHaveLength(100);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(searchCondition);

    result.forEach((item) => {
      expect(item.similarityScore).toBeGreaterThanOrEqual(0);
      expect(item.similarityScore).toBeLessThanOrEqual(1);
      expect(item.dealId).toBeDefined();
      expect(item.productCategory).toBeDefined();
      expect(item.customerIndustry).toBeDefined();
      expect(item.contractAmount).toBeDefined();
    });

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].similarityScore).toBeGreaterThanOrEqual(result[i + 1].similarityScore);
    }

    const dealIds = new Set(result.map((item) => item.dealId));
    expect(dealIds.size).toBe(100);
  });
});