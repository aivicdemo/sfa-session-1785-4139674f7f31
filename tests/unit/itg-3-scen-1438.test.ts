import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ推奨機能', () => {
  // SCEN-1438
  test('過去商談データの期間が年度をまたぐとき、正常に抽出される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const historicalDeals = [
      {
        id: 'deal_1',
        date: new Date('2024-03-15T10:00:00Z'),
        fiscalYear: 2023,
        industry: 'manufacturing',
        companySize: 'mid_market',
        amount: 5000000,
        status: 'won',
      },
      {
        id: 'deal_2',
        date: new Date('2024-04-10T14:30:00Z'),
        fiscalYear: 2024,
        industry: 'manufacturing',
        companySize: 'mid_market',
        amount: 7500000,
        status: 'won',
      },
      {
        id: 'deal_3',
        date: new Date('2024-12-20T09:15:00Z'),
        fiscalYear: 2024,
        industry: 'manufacturing',
        companySize: 'mid_market',
        amount: 6000000,
        status: 'won',
      },
    ];

    const newOpportunity = {
      industry: 'manufacturing',
      companySize: 'mid_market',
      dealPeriodStart: new Date('2024-04-01T00:00:00Z'),
      dealPeriodEnd: new Date('2024-05-31T23:59:59Z'),
    };

    const expectedResult = {
      matchedPatterns: [
        {
          id: 'deal_1',
          date: new Date('2024-03-15T10:00:00Z'),
          fiscalYear: 2023,
          industry: 'manufacturing',
          companySize: 'mid_market',
          amount: 5000000,
          status: 'won',
          similarityScore: 0.92,
        },
        {
          id: 'deal_2',
          date: new Date('2024-04-10T14:30:00Z'),
          fiscalYear: 2024,
          industry: 'manufacturing',
          companySize: 'mid_market',
          amount: 7500000,
          status: 'won',
          similarityScore: 0.98,
        },
        {
          id: 'deal_3',
          date: new Date('2024-12-20T09:15:00Z'),
          fiscalYear: 2024,
          industry: 'manufacturing',
          companySize: 'mid_market',
          amount: 6000000,
          status: 'won',
          similarityScore: 0.85,
        },
      ],
      totalPatterns: 3,
      fiscalYearsIncluded: [2023, 2024],
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue(
      expectedResult
    );

    const result = await findSimilarPatterns(
      newOpportunity,
      historicalDeals,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newOpportunity,
      historicalDeals
    );
    expect(result.matchedPatterns).toHaveLength(3);
    expect(result.matchedPatterns[0].id).toBe('deal_1');
    expect(result.matchedPatterns[0].fiscalYear).toBe(2023);
    expect(result.matchedPatterns[1].id).toBe('deal_2');
    expect(result.matchedPatterns[1].fiscalYear).toBe(2024);
    expect(result.matchedPatterns[2].id).toBe('deal_3');
    expect(result.matchedPatterns[2].fiscalYear).toBe(2024);
    expect(result.totalPatterns).toBe(3);
    expect(result.fiscalYearsIncluded).toEqual([2023, 2024]);
    expect(result.matchedPatterns[0].date.getTime()).toBe(
      new Date('2024-03-15T10:00:00Z').getTime()
    );
    expect(result.matchedPatterns[1].date.getTime()).toBe(
      new Date('2024-04-10T14:30:00Z').getTime()
    );
    expect(result.matchedPatterns[2].date.getTime()).toBe(
      new Date('2024-12-20T09:15:00Z').getTime()
    );
  });
});