import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('提案妥当性判定機能', () => {
  test('SCEN-1180: 顧客ニーズ・営業プロセス・リスク要因すべてに適合する提案が承認判定される', () => {
    const stub_AIRecommendationEngine = {
      generateRecommendation: jest.fn(() => ({
        approach: '高度なカスタマイズ、段階的導入、セキュリティ監査含む',
        confidenceScore: 0.92,
      })),
      findSimilarPatterns: jest.fn(() => [
        {
          caseId: 'case_001',
          budget: 5000000,
          implementationPeriodMonths: 3,
          securityRequired: true,
          similarity: 0.95,
        },
        {
          caseId: 'case_002',
          budget: 4800000,
          implementationPeriodMonths: 3,
          securityRequired: true,
          similarity: 0.92,
        },
        {
          caseId: 'case_003',
          budget: 5200000,
          implementationPeriodMonths: 3,
          securityRequired: true,
          similarity: 0.88,
        },
      ]),
      evaluatePatternRelevance: jest.fn(() => ({
        applicabilityScore: 0.90,
        isApplicable: true,
      })),
    };

    const proposal_input = {
      customerId: 'cust_12345',
      dealId: 'deal_67890',
      customerNeeds: {
        budget: 5000000,
        implementationPeriodMonths: 3,
        securityPriority: true,
      },
      salesProcessStage: 'proposal',
      proposalApproach:
        '高度なカスタマイズ、段階的導入、セキュリティ監査含む',
      riskFactors: {
        existingSystemIntegrationComplexity: 'medium',
      },
      aiRecommendationEngine: stub_AIRecommendationEngine,
    };

    const result = evaluateProposalValidity(proposal_input);

    expect(result.status).toBe('approved');
    expect(result.needsAdherenceScore).toBe(0.90);
    expect(result.processAdherenceScore).toBe(0.88);
    expect(result.riskToleranceScore).toBe(0.87);
    expect(result.reasoningDetail).toEqual({
      needsScoreDetail: {
        value: 0.90,
        threshold: 0.85,
        satisfied: true,
      },
      processScoreDetail: {
        value: 0.88,
        threshold: 0.85,
        satisfied: true,
      },
      riskScoreDetail: {
        value: 0.87,
        threshold: 0.85,
        satisfied: true,
      },
      explanation:
        'すべての判定軸が基準を満たしています',
    });
  });
});