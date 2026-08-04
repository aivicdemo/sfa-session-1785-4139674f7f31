import { visualizeRecommendationBasis } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1914
  test('期間開始日と終了日が同日のときに該当日の根拠のみ返却される', () => {
    const targetDate = '2026-08-15';
    const startDate = '2026-08-15';
    const endDate = '2026-08-15';

    const stubRecommendationBasis = [
      {
        recommendationId: 'rec_001',
        dealId: 'deal_123',
        customerId: 'cust_456',
        basisType: 'past_success_pattern',
        basisData: {
          similarPatternId: 'pattern_789',
          matchScore: 0.92,
          pastDealSummary: '同業種での成功事例',
          recommendedApproach: '段階的アプローチ',
        },
        timestamp: '2026-08-15T10:30:00Z',
        createdAt: '2026-08-15T10:30:00Z',
      },
      {
        recommendationId: 'rec_002',
        dealId: 'deal_123',
        customerId: 'cust_456',
        basisType: 'customer_segment_analysis',
        basisData: {
          segmentId: 'seg_101',
          segmentName: '大企業・IT業界',
          averageContractValue: 5000000,
          successRate: 0.78,
          recommendedTiming: '年度末決算前',
        },
        timestamp: '2026-08-15T10:35:00Z',
        createdAt: '2026-08-15T10:35:00Z',
      },
    ];

    const otherDateBasis = [
      {
        recommendationId: 'rec_003',
        dealId: 'deal_123',
        customerId: 'cust_456',
        basisType: 'past_success_pattern',
        basisData: {
          similarPatternId: 'pattern_800',
          matchScore: 0.85,
          pastDealSummary: '異業種での参考事例',
          recommendedApproach: '並行アプローチ',
        },
        timestamp: '2026-08-14T15:00:00Z',
        createdAt: '2026-08-14T15:00:00Z',
      },
      {
        recommendationId: 'rec_004',
        dealId: 'deal_123',
        customerId: 'cust_456',
        basisType: 'customer_segment_analysis',
        basisData: {
          segmentId: 'seg_102',
          segmentName: '中小企業・製造業',
          averageContractValue: 2000000,
          successRate: 0.65,
          recommendedTiming: '中期経営計画時期',
        },
        timestamp: '2026-08-16T09:00:00Z',
        createdAt: '2026-08-16T09:00:00Z',
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      getRecommendationBasisByDateRange: jest.fn().mockResolvedValue(
        stubRecommendationBasis.concat(otherDateBasis)
      ),
    };

    const result = visualizeRecommendationBasis(
      {
        recommendationId: 'rec_001',
        dealId: 'deal_123',
        customerId: 'cust_456',
        startDate,
        endDate,
      },
      mockAIEngine
    );

    return result.then((basisList) => {
      expect(basisList).toHaveLength(2);

      expect(basisList[0]).toEqual({
        recommendationId: 'rec_001',
        dealId: 'deal_123',
        customerId: 'cust_456',
        basisType: 'past_success_pattern',
        basisData: {
          similarPatternId: 'pattern_789',
          matchScore: 0.92,
          pastDealSummary: '同業種での成功事例',
          recommendedApproach: '段階的アプローチ',
        },
        timestamp: '2026-08-15T10:30:00Z',
        createdAt: '2026-08-15T10:30:00Z',
      });

      expect(basisList[1]).toEqual({
        recommendationId: 'rec_002',
        dealId: 'deal_123',
        customerId: 'cust_456',
        basisType: 'customer_segment_analysis',
        basisData: {
          segmentId: 'seg_101',
          segmentName: '大企業・IT業界',
          averageContractValue: 5000000,
          successRate: 0.78,
          recommendedTiming: '年度末決算前',
        },
        timestamp: '2026-08-15T10:35:00Z',
        createdAt: '2026-08-15T10:35:00Z',
      });

      basisList.forEach((basis) => {
        const basisDate = basis.timestamp.split('T')[0];
        expect(basisDate).toBe(targetDate);
      });

      basisList.forEach((basis) => {
        const createdDate = basis.createdAt.split('T')[0];
        expect(createdDate).toBe(targetDate);
      });
    });
  });
});