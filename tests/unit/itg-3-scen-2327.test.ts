import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2327
  test('過去商談データに同一成功パターンが複数件含まれるとき全件が集計に含まれる', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          patternName: '大規模製造業向け予算1000万円以上決裁者複数',
          matchScore: 0.92,
          occurrenceCount: 1,
          dealId: 'DEAL-001',
          customerIndustry: '製造業',
          customerScale: '大規模',
          budgetAmount: 10000000,
          decisionMakerCount: 3,
          successFlag: true,
          dealClosedDate: '2024-01-15T00:00:00Z',
        },
        {
          patternId: 'PAT-001',
          patternName: '大規模製造業向け予算1000万円以上決裁者複数',
          matchScore: 0.89,
          occurrenceCount: 2,
          dealId: 'DEAL-002',
          customerIndustry: '製造業',
          customerScale: '大規模',
          budgetAmount: 12000000,
          decisionMakerCount: 4,
          successFlag: true,
          dealClosedDate: '2024-02-10T00:00:00Z',
        },
        {
          patternId: 'PAT-001',
          patternName: '大規模製造業向け予算1000万円以上決裁者複数',
          matchScore: 0.85,
          occurrenceCount: 3,
          dealId: 'DEAL-003',
          customerIndustry: '製造業',
          customerScale: '大規模',
          budgetAmount: 15000000,
          decisionMakerCount: 5,
          successFlag: true,
          dealClosedDate: '2024-03-20T00:00:00Z',
        },
      ]),
    };

    const newDealCondition = {
      customerIndustry: '製造業',
      customerScale: '大規模',
      budgetAmount: 15000000,
      decisionMakerCount: 5,
    };

    const result = findSimilarPatterns(
      newDealCondition,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.patternId).toBe('PAT-001');
    expect(result.matchedDealsCount).toBe(3);
    expect(result.weightedScore).toBe(2.66);
    expect(result.totalPatternInstances).toBe(3);
    expect(result.averageMatchScore).toBeCloseTo(0.8867, 2);
    expect(result.countOccurrences).toBe(3);
    expect(result.priorityWeight).toBe(3);
    expect(result.matchedDeals).toHaveLength(3);
    expect(result.matchedDeals[0].dealId).toBe('DEAL-001');
    expect(result.matchedDeals[1].dealId).toBe('DEAL-002');
    expect(result.matchedDeals[2].dealId).toBe('DEAL-003');
    expect(result.matchedDeals[0].matchScore).toBe(0.92);
    expect(result.matchedDeals[1].matchScore).toBe(0.89);
    expect(result.matchedDeals[2].matchScore).toBe(0.85);
  });
});