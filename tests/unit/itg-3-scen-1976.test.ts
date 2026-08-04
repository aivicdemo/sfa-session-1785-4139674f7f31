import { generatePersuasiveDocument } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-1976: [normal] 経営層向け説得資料の自動生成機能 - 提案に紐付く顧客制約条件が照合評価結果に反映されて説得資料に含まれる', () => {
    const customerId = 'CUST-001';
    const proposalId = 'PROP-001';
    const deadlineConstraint = '2026年3月末までに導入完了必須';
    const budgetLimit = 5000000;
    const systemIntegrationRequired = true;

    const customerConstraints = {
      customerId,
      deadline: new Date('2026-03-31T23:59:59Z'),
      budgetUpperLimit: budgetLimit,
      requiresExistingSystemIntegration: systemIntegrationRequired,
    };

    const proposalContent = {
      proposalId,
      customerId,
      productName: 'Enterprise System Solution',
      proposedPrice: 4500000,
      implementationSchedule: {
        startDate: new Date('2026-01-15T00:00:00Z'),
        completionDate: new Date('2026-03-20T00:00:00Z'),
      },
      technicalApproach: 'REST API integration with existing legacy system',
    };

    const matchingEvaluationResult = {
      proposalId,
      customerId,
      deadlineAdherence: {
        constraint: deadlineConstraint,
        proposedCompletionDate: new Date('2026-03-20T00:00:00Z'),
        isCompliant: true,
        complianceScore: 95,
      },
      budgetCompliance: {
        budgetUpperLimit,
        proposedPrice: 4500000,
        isCompliant: true,
        complianceScore: 90,
      },
      systemIntegrationCapability: {
        requiresIntegration: systemIntegrationRequired,
        integrationType: 'REST API integration',
        isCapable: true,
        complianceScore: 88,
      },
      overallAdherenceScore: 91,
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        proposalApproach: 'Phase-based implementation with 8-week delivery cycle to meet March deadline',
        evidenceData: [
          'Similar projects completed on-time with 95% success rate',
          'Budget-optimized architecture reduces cost by 10%',
        ],
        recommendationRelevanceScore: 92,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          caseId: 'CASE-2025-001',
          similarity: 0.87,
          budgetMatch: true,
          deadlineMatch: true,
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'Recommended approach based on 3 similar cases with 87% average pattern match. Budget allocation prioritizes core integration; optional features staged for post-launch. Phased delivery ensures March deadline compliance.'
      ),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicabilityScore: 91,
        deadlineRisk: 'Low',
        budgetRisk: 'Low',
        integrationRisk: 'Medium',
      }),
    };

    const generatedDocument = generatePersuasiveDocument(
      proposalContent,
      customerConstraints,
      matchingEvaluationResult,
      mockAIRecommendationEngine
    );

    expect(generatedDocument).toBeDefined();
    expect(generatedDocument.documentType).toBe('ExecutivePersuasionDocument');
    expect(generatedDocument.customerId).toBe(customerId);
    expect(generatedDocument.proposalId).toBe(proposalId);

    expect(generatedDocument.constraints).toBeDefined();
    expect(generatedDocument.constraints.deadline).toBeDefined();
    expect(generatedDocument.constraints.deadline.constraint).toBe(deadlineConstraint);
    expect(generatedDocument.constraints.deadline.proposedSchedule).toContain('2026-03-20');
    expect(generatedDocument.constraints.deadline.complianceScore).toBe(95);

    expect(generatedDocument.constraints.budget).toBeDefined();
    expect(generatedDocument.constraints.budget.upperLimit).toBe(budgetLimit);
    expect(generatedDocument.constraints.budget.proposedPrice).toBe(4500000);
    expect(generatedDocument.constraints.budget.complianceScore).toBe(90);

    expect(generatedDocument.constraints.systemIntegration).toBeDefined();
    expect(generatedDocument.constraints.systemIntegration.requirement).toBe(
      'Existing system integration required'
    );
    expect(generatedDocument.constraints.systemIntegration.technicalApproach).toContain(
      'REST API'
    );
    expect(generatedDocument.constraints.systemIntegration.complianceScore).toBe(88);

    expect(generatedDocument.overallComplianceScore).toBe(91);
    expect(generatedDocument.overallComplianceScore).toBeGreaterThanOrEqual(85);

    expect(generatedDocument.executiveSummary).toBeDefined();
    expect(generatedDocument.executiveSummary).toContain('Enterprise System Solution');
    expect(generatedDocument.executiveSummary).toContain('March');

    expect(generatedDocument.constraintMapToProposal).toBeDefined();
    expect(generatedDocument.constraintMapToProposal.length).toBeGreaterThan(0);
    expect(
      generatedDocument.constraintMapToProposal.find(
        (m: { constraintType: string }) => m.constraintType === 'deadline'
      )
    ).toBeDefined();
    expect(
      generatedDocument.constraintMapToProposal.find(
        (m: { constraintType: string }) => m.constraintType === 'budget'
      )
    ).toBeDefined();
    expect(
      generatedDocument.constraintMapToProposal.find(
        (m: { constraintType: string }) => m.constraintType === 'systemIntegration'
      )
    ).toBeDefined();

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId,
        constraints: expect.objectContaining({
          deadline: customerConstraints.deadline,
          budgetUpperLimit,
        }),
      })
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});