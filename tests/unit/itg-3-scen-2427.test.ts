import { calculateRecommendationScores } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能 - 顧客条件に基づくパターン除外', () => {
  test('SCEN-2427: 顧客条件に一致しない成功パターンが除外される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue([
        {
          patternId: 'P001',
          relevanceScore: 0.95,
          customerSegment: 'Enterprise',
          dealSize: 'Large'
        },
        {
          patternId: 'P002',
          relevanceScore: 0.78,
          customerSegment: 'SMB',
          dealSize: 'Small'
        },
        {
          patternId: 'P003',
          relevanceScore: 0.82,
          customerSegment: 'Enterprise',
          dealSize: 'Medium'
        }
      ])
    };

    const inputCustomerCondition = {
      customerSegment: 'SMB',
      dealSize: 'Large',
      industry: 'Technology'
    };

    const result = calculateRecommendationScores(
      inputCustomerCondition,
      mockAIEngine
    );

    expect(result).toEqual([
      {
        patternId: 'P001',
        relevanceScore: 0.95,
        customerSegment: 'Enterprise',
        dealSize: 'Large'
      }
    ]);

    expect(result.length).toBe(1);
    expect(result[0].patternId).toBe('P001');
  });
});