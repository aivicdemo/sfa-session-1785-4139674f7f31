import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理 - 一致度の小数点丸め精度', () => {
  // SCEN-1608
  test('一致度計算結果が指定された小数第2位で正確に丸められている', async () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          customerId: 'cust_001',
          similarityScore: 0.8756,
          matchedPatterns: ['industry_match', 'size_match'],
        },
        {
          customerId: 'cust_002',
          similarityScore: 0.6234,
          matchedPatterns: ['industry_match'],
        },
        {
          customerId: 'cust_003',
          similarityScore: 0.9145,
          matchedPatterns: ['industry_match', 'size_match', 'revenue_match'],
        },
        {
          customerId: 'cust_004',
          similarityScore: 0.5449,
          matchedPatterns: ['size_match'],
        },
      ]),
    };

    const currentDealCondition = {
      industry: 'IT',
      companySize: 'large',
      revenue: 1000000000,
      dealStage: 'discovery',
    };

    const result = await findSimilarPatterns(
      currentDealCondition,
      mockAIEngine,
      2
    );

    expect(result).toHaveLength(4);

    expect(result[0]).toEqual({
      customerId: 'cust_001',
      similarityScore: 0.88,
      matchedPatterns: ['industry_match', 'size_match'],
    });

    expect(result[1]).toEqual({
      customerId: 'cust_002',
      similarityScore: 0.62,
      matchedPatterns: ['industry_match'],
    });

    expect(result[2]).toEqual({
      customerId: 'cust_003',
      similarityScore: 0.91,
      matchedPatterns: ['industry_match', 'size_match', 'revenue_match'],
    });

    expect(result[3]).toEqual({
      customerId: 'cust_004',
      similarityScore: 0.54,
      matchedPatterns: ['size_match'],
    });

    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      currentDealCondition
    );
  });
});