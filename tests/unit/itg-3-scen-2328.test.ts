import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2328
  test('月末で始まり月初で終わる抽出対象期間で、月をまたいだ商談が正しく抽出される', () => {
    const successPatternDatabase = [
      {
        dealId: 'DEAL_A',
        startDate: new Date('2024-01-31T09:00:00Z'),
        endDate: new Date('2024-02-01T17:00:00Z'),
        successFlag: true,
        pattern: '月末から月初への継続型提案',
        customerId: 'CUST_001',
        dealAmount: 500000,
      },
      {
        dealId: 'DEAL_B',
        startDate: new Date('2024-01-29T09:00:00Z'),
        endDate: new Date('2024-01-30T17:00:00Z'),
        successFlag: true,
        pattern: '月内完結型提案',
        customerId: 'CUST_002',
        dealAmount: 300000,
      },
      {
        dealId: 'DEAL_C',
        startDate: new Date('2024-02-02T09:00:00Z'),
        endDate: new Date('2024-02-03T17:00:00Z'),
        successFlag: true,
        pattern: '月初型提案',
        customerId: 'CUST_003',
        dealAmount: 400000,
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn((extractionPeriodStart, extractionPeriodEnd) => {
        return successPatternDatabase.filter((deal) => {
          const dealStartInRange =
            deal.startDate >= extractionPeriodStart && deal.startDate <= extractionPeriodEnd;
          const dealEndInRange =
            deal.endDate >= extractionPeriodStart && deal.endDate <= extractionPeriodEnd;
          return dealStartInRange && dealEndInRange && deal.successFlag === true;
        });
      }),
    };

    const extractionPeriodStart = new Date('2024-01-31T00:00:00Z');
    const extractionPeriodEnd = new Date('2024-02-01T23:59:59Z');

    const result = findSimilarPatterns(extractionPeriodStart, extractionPeriodEnd, mockAIRecommendationEngine);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      extractionPeriodStart,
      extractionPeriodEnd
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        dealId: 'DEAL_A',
        startDate: new Date('2024-01-31T09:00:00Z'),
        endDate: new Date('2024-02-01T17:00:00Z'),
        successFlag: true,
        pattern: '月末から月初への継続型提案',
      })
    );

    const dealIds = result.map((deal) => deal.dealId);
    expect(dealIds).not.toContain('DEAL_B');
    expect(dealIds).not.toContain('DEAL_C');
  });
});