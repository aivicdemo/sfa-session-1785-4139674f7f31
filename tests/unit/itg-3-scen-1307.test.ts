import { evaluateProposalConstraintCompatibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-1307
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - 提案の実装スケジュールが顧客の期間制約内に収まるとき、スケジュール適合性が判定される', () => {
    const customerConstraint = {
      constraintStartDate: new Date('2026-04-01'),
      constraintEndDate: new Date('2026-06-30'),
      maxBudgetAmount: 5000000,
      purchaseFrequencyLimit: 4,
    };

    const proposalContent = {
      proposalStartDate: new Date('2026-04-15'),
      proposalEndDate: new Date('2026-06-15'),
      estimatedBudget: 3500000,
      expectedDeliveryCount: 2,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: 'Standard implementation approach',
        scheduleFeasibility: true,
        budgetFeasibility: true,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = evaluateProposalConstraintCompatibility(
      proposalContent,
      customerConstraint,
      mockAIEngine
    );

    expect(result.scheduleCompatibility).toBe(true);
    expect(result.scheduleCompatibilityReason).toBe(
      '提案期間2026年4月15日～6月15日は顧客の制約期間2026年4月1日～6月30日に完全に包含される'
    );
    expect(result.budgetCompatibility).toBe(true);
    expect(result.frequencyCompatibility).toBe(true);
  });
});