import { extractAndStructurizeSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能 - 失敗要因の重複統合', () => {
  // SCEN-2533
  test('失敗要因に同値が並んでいるとき、1つにまとめられる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue({
        successPatterns: [],
        pastDeals: [
          {
            dealId: 'deal_001',
            customerId: 'cust_001',
            dealAmount: 5000000,
            outcome: 'failed',
            failureReasons: ['顧客予算不足'],
            extractedAt: new Date('2024-01-10T10:00:00Z'),
          },
          {
            dealId: 'deal_002',
            customerId: 'cust_002',
            dealAmount: 3000000,
            outcome: 'failed',
            failureReasons: ['顧客予算不足'],
            extractedAt: new Date('2024-01-15T10:00:00Z'),
          },
          {
            dealId: 'deal_003',
            customerId: 'cust_003',
            dealAmount: 4000000,
            outcome: 'failed',
            failureReasons: ['顧客予算不足'],
            extractedAt: new Date('2024-01-20T10:00:00Z'),
          },
          {
            dealId: 'deal_004',
            customerId: 'cust_004',
            dealAmount: 2000000,
            outcome: 'failed',
            failureReasons: ['競合優位性不足'],
            extractedAt: new Date('2024-01-25T10:00:00Z'),
          },
          {
            dealId: 'deal_005',
            customerId: 'cust_005',
            dealAmount: 6000000,
            outcome: 'failed',
            failureReasons: ['実装スケジュール不適合'],
            extractedAt: new Date('2024-02-01T10:00:00Z'),
          },
          {
            dealId: 'deal_006',
            customerId: 'cust_006',
            dealAmount: 3500000,
            outcome: 'failed',
            failureReasons: ['顧客予算不足'],
            extractedAt: new Date('2024-02-05T10:00:00Z'),
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.85,
        applicability: true,
      }),
    };

    const input = {
      currentDealConditions: {
        customerId: 'cust_new_001',
        customerIndustry: 'manufacturing',
        dealValue: 4500000,
        productCategory: 'enterprise_software',
      },
      aiEngine: mockAIEngine,
    };

    return extractAndStructurizeSuccessPatterns(input).then((result) => {
      expect(result.failureFactors).toBeDefined();
      expect(Array.isArray(result.failureFactors)).toBe(true);

      const budgetShortageEntry = result.failureFactors.find(
        (entry: any) => entry.failureReason === '顧客予算不足'
      );
      expect(budgetShortageEntry).toBeDefined();
      expect(budgetShortageEntry.occurrenceCount).toBe(3);
      expect(budgetShortageEntry.occurrenceRate).toBe(15);

      expect(result.failureFactors.length).toBe(3);

      const competitiveEntry = result.failureFactors.find(
        (entry: any) => entry.failureReason === '競合優位性不足'
      );
      expect(competitiveEntry).toBeDefined();
      expect(competitiveEntry.occurrenceCount).toBe(1);

      const scheduleEntry = result.failureFactors.find(
        (entry: any) => entry.failureReason === '実装スケジュール不適合'
      );
      expect(scheduleEntry).toBeDefined();
      expect(scheduleEntry.occurrenceCount).toBe(1);
    });
  });
});