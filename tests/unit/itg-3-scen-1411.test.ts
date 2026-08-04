import { evaluatePatternRelevanceForConstraints } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1411
  test('[edge] 提案内容と顧客制約条件の自動照合機能 - スケジュール制約が年度をまたぐとき、実装可能性が正しく判定される', () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        feasibilityScore: 0.85,
        reasoning: '年度をまたぐ制約内で提案期間全体が実装可能'
      })
    };

    const customerConstraintData = {
      customerId: 'CUST-2026-001',
      fiscalYearStartDate: new Date('2026-04-01T00:00:00Z'),
      fiscalYearEndDate: new Date('2027-03-31T23:59:59Z'),
      constraintStartDate: new Date('2026-02-01T00:00:00Z'),
      constraintEndDate: new Date('2027-04-30T23:59:59Z'),
      isFiscalYearSpanning: true,
      maxImplementationMonths: 12,
      budgetConstraint: 50000000
    };

    const proposalContent = {
      proposalId: 'PROP-2026-001',
      projectName: 'システム導入プロジェクト',
      developmentStartDate: new Date('2026-02-01T00:00:00Z'),
      developmentEndDate: new Date('2026-07-31T23:59:59Z'),
      developmentMonths: 6,
      testingStartDate: new Date('2026-08-01T00:00:00Z'),
      testingEndDate: new Date('2026-10-31T23:59:59Z'),
      testingMonths: 3,
      productionLaunchDate: new Date('2027-03-31T00:00:00Z'),
      totalImplementationMonths: 9,
      estimatedCost: 45000000
    };

    const result = evaluatePatternRelevanceForConstraints(
      proposalContent,
      customerConstraintData,
      aiRecommendationEngineStub
    );

    expect(result.isImplementableFeasible).toBe(true);
    expect(result.feasibilityScore).toBeGreaterThanOrEqual(0.85);
    expect(result.feasibilityScore).toBeLessThanOrEqual(1.0);
    expect(result.evaluationReasoning).toMatch(/年度をまたぐ制約内で提案期間全体が実装可能/);
    expect(result.proposalScheduleFitsWithinConstraint).toBe(true);
    expect(result.isBudgetCompliant).toBe(true);
    expect(result.isScheduleCompliant).toBe(true);
  });
});