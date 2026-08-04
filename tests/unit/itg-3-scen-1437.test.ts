import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-1437
  test('[edge] 成功パターン抽出と提案アプローチ推奨機能 - 過去商談データの期間が月末と月初をまたぐとき、正常に抽出される', () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn((dealConditions, searchPeriod) => {
        return [
          {
            patternId: 'pattern_success_A',
            dealDate: '2024-02-28T15:30:00Z',
            customerSegment: 'large_enterprise',
            industryType: 'manufacturing',
            proposalAmount: 5000000,
            successRate: 0.85,
            patternName: 'Strategic Partnership Model',
            dealDuration: 90,
            touchPointCount: 8,
          },
          {
            patternId: 'pattern_success_B',
            dealDate: '2024-03-01T10:15:00Z',
            customerSegment: 'mid_market',
            industryType: 'finance',
            proposalAmount: 2500000,
            successRate: 0.78,
            patternName: 'Quick Win Approach',
            dealDuration: 45,
            touchPointCount: 5,
          },
        ];
      }),
      generateRecommendation: jest.fn((conditions, patterns) => {
        return {
          recommendedApproaches: [
            {
              approachId: 'approach_001',
              name: 'Strategic Partnership Model',
              applicableScore: 0.82,
              reasoning: 'Based on pattern_success_A from 2024-02-28. Similar large enterprise with high strategic value.',
              keyActions: [
                'Schedule executive alignment meeting',
                'Prepare ROI presentation',
                'Establish governance structure',
              ],
              expectedOutcome: 'Long-term partnership with expansion potential',
            },
            {
              approachId: 'approach_002',
              name: 'Quick Win Approach',
              applicableScore: 0.71,
              reasoning: 'Based on pattern_success_B from 2024-03-01. Applicable for accelerated deal closure.',
              keyActions: [
                'Identify quick implementation wins',
                'Fast-track pilot program',
                'Establish success metrics early',
              ],
              expectedOutcome: 'Rapid deployment and early value realization',
            },
          ],
          overallConfidenceScore: 79,
          reasoning:
            'Successfully extracted patterns spanning month-end (2024-02-28) and month-start (2024-03-01). Both enterprise and mid-market segments covered with complementary approaches.',
          metadata: {
            patternsFound: 2,
            searchPeriodStart: '2024-02-25T00:00:00Z',
            searchPeriodEnd: '2024-03-05T23:59:59Z',
            extractedPatterns: [
              {
                patternId: 'pattern_success_A',
                dealDate: '2024-02-28T15:30:00Z',
                customerSegment: 'large_enterprise',
                proposalAmount: 5000000,
              },
              {
                patternId: 'pattern_success_B',
                dealDate: '2024-03-01T10:15:00Z',
                customerSegment: 'mid_market',
                proposalAmount: 2500000,
              },
            ],
          },
        };
      }),
    };

    const newDealCondition = {
      customerId: 'cust_12345',
      customerName: 'New Enterprise Corp',
      industry: 'manufacturing',
      companySize: 'large',
      estimatedBudget: 4500000,
      dealStage: 'qualification',
      targetDecisionDate: '2024-06-30T23:59:59Z',
    };

    const searchPeriod = {
      startDate: '2024-02-25T00:00:00Z',
      endDate: '2024-03-05T23:59:59Z',
    };

    const result = generateRecommendation(
      newDealCondition,
      searchPeriod,
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition,
      searchPeriod
    );

    expect(result.recommendedApproaches).toHaveLength(2);

    const patternA = result.recommendedApproaches.find(
      (a) => a.approachId === 'approach_001'
    );
    const patternB = result.recommendedApproaches.find(
      (a) => a.approachId === 'approach_002'
    );

    expect(patternA).toBeDefined();
    expect(patternA?.name).toBe('Strategic Partnership Model');
    expect(patternA?.applicableScore).toBe(0.82);
    expect(patternA?.reasoning).toContain('2024-02-28');
    expect(patternA?.keyActions).toContain('Schedule executive alignment meeting');

    expect(patternB).toBeDefined();
    expect(patternB?.name).toBe('Quick Win Approach');
    expect(patternB?.applicableScore).toBe(0.71);
    expect(patternB?.reasoning).toContain('2024-03-01');
    expect(patternB?.keyActions).toContain('Identify quick implementation wins');

    expect(result.overallConfidenceScore).toBe(79);
    expect(result.reasoning).toContain('month-end');
    expect(result.reasoning).toContain('month-start');

    expect(result.metadata.patternsFound).toBe(2);
    expect(result.metadata.searchPeriodStart).toBe('2024-02-25T00:00:00Z');
    expect(result.metadata.searchPeriodEnd).toBe('2024-03-05T23:59:59Z');

    expect(result.metadata.extractedPatterns).toHaveLength(2);
    expect(result.metadata.extractedPatterns[0].patternId).toBe(
      'pattern_success_A'
    );
    expect(result.metadata.extractedPatterns[0].dealDate).toBe(
      '2024-02-28T15:30:00Z'
    );
    expect(result.metadata.extractedPatterns[0].customerSegment).toBe(
      'large_enterprise'
    );
    expect(result.metadata.extractedPatterns[0].proposalAmount).toBe(5000000);

    expect(result.metadata.extractedPatterns[1].patternId).toBe(
      'pattern_success_B'
    );
    expect(result.metadata.extractedPatterns[1].dealDate).toBe(
      '2024-03-01T10:15:00Z'
    );
    expect(result.metadata.extractedPatterns[1].customerSegment).toBe(
      'mid_market'
    );
    expect(result.metadata.extractedPatterns[1].proposalAmount).toBe(2500000);
  });
});