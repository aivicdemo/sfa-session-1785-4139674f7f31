import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { determineGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-431
  test('改善対象項目が0件の場合、方針に該当項目が含まれない', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: 'standard_proposal',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('Pattern match found'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.92),
    };

    const mockDataQualityEngine = {
      validateAndScoreQuality: jest.fn().mockReturnValue({
        score: 88,
        improvementItems: [],
      }),
    };

    const inputData = {
      customerId: 'CUST-2024-001',
      customerIndustry: 'IT',
      customerSize: 'mid-market',
      dealAmount: 500000,
      dealStage: 'proposal',
      proposalContent: 'Cloud migration service',
      historicalSuccessPatterns: [
        {
          industry: 'IT',
          dealSize: 'mid-market',
          successRate: 0.78,
          patternId: 'PAT-001',
        },
      ],
    };

    const result = determineGuidancePolicy(
      inputData,
      mockAIEngine,
      mockDataQualityEngine,
    );

    expect(result).toHaveProperty('guidancePolicies');
    expect(result).toHaveProperty('improvementItemsFiltered');
    expect(result.improvementItemsFiltered).toEqual([]);
    expect(result.improvementItemsFiltered).toHaveLength(0);

    const policiesRelatedToImprovement = result.guidancePolicies.filter(
      (policy: { type: string }) =>
        policy.type === 'improvement_focus' ||
        policy.type === 'data_quality_remediation',
    );
    expect(policiesRelatedToImprovement).toHaveLength(0);

    expect(result).toHaveProperty('policyGenerationLog');
    expect(result.policyGenerationLog).toMatch(/改善対象項目/);
  });
});