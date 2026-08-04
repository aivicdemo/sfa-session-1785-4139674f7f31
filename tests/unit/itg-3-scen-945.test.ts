import { evaluateProposalAgainstConstraints } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 照合評価結果管理', () => {
  // SCEN-945
  test('提案と顧客制約条件の整合性が照合評価結果テーブルに記録される', () => {
    const customerId = 'CUST-001';
    const proposalId = 'PROP-A';
    const proposalContent = {
      name: '提案A：SaaS型ソリューション',
      estimatedCost: 900000,
      implementationPeriodDays: 60,
      isCloudBased: true,
    };
    const customerConstraints = {
      budgetLimit: 1000000,
      maxImplementationDays: 90,
      requiresCloudBased: true,
    };
    const evaluationScore = 0.95;
    const evaluationTimestamp = new Date('2024-01-15T11:00:00Z');

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalId,
        content: proposalContent,
      }),
      evaluatePatternRelevance: jest.fn().mockReturnValue(evaluationScore),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(''),
    };

    const result = evaluateProposalAgainstConstraints(
      {
        customerId,
        proposalId,
        proposal: proposalContent,
        constraints: customerConstraints,
        evaluationScore,
        evaluatedAt: evaluationTimestamp,
      },
      mockAIEngine,
    );

    expect(result.caseId).toBe(customerId);
    expect(result.proposalId).toBe(proposalId);
    expect(result.conformanceJudgment).toBe('制約条件内');
    expect(result.evaluationScore).toBe(0.95);
    expect(result.constraintMapping).toEqual({
      budgetConformance: true,
      implementationDurationConformance: true,
      requirementConformance: true,
    });
    expect(result.evaluationStatus).toBe('承認可能');
    expect(result.recordedAt).toEqual(new Date('2024-01-15T11:00:00Z'));
    expect(result.constraintDetails).toEqual({
      budget: {
        proposedAmount: 900000,
        limit: 1000000,
        isWithinLimit: true,
      },
      duration: {
        proposedDays: 60,
        maxDays: 90,
        isWithinLimit: true,
      },
      requirement: {
        requiresCloud: true,
        isCloudBased: true,
        isSatisfied: true,
      },
    });
  });
});