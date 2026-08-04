import { evaluateCustomerConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1315
  test('[normal] 提案内容と顧客制約条件の自動照合機能 - 顧客制約条件データが1件のとき、その制約に対する単一の適合性判定が実行される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.87),
    };

    const newCaseData = {
      customerId: 'CUST-001',
      industry: 'manufacturing',
      companySize: 'large',
      businessChallenge: 'cost_reduction',
      proposedApproach: 'process_automation',
      estimatedInvestment: 4500000,
    };

    const customerConstraints = [
      {
        constraintId: 'CONST-001',
        customerId: 'CUST-001',
        constraintType: 'budget_limit',
        constraintValue: 5000000,
        description: '予算上限500万円',
      },
    ];

    const result = evaluateCustomerConstraintAlignment(
      newCaseData,
      customerConstraints,
      mockAIEngine
    );

    expect(customerConstraints).toHaveLength(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: 'CUST-001',
        proposedApproach: 'process_automation',
        estimatedInvestment: 4500000,
      }),
      expect.objectContaining({
        constraintId: 'CONST-001',
        constraintType: 'budget_limit',
        constraintValue: 5000000,
      })
    );
    expect(result).toEqual(
      expect.objectContaining({
        alignmentScore: 0.87,
        constraintCount: 1,
        evaluatedConstraints: expect.arrayContaining([
          expect.objectContaining({
            constraintId: 'CONST-001',
            score: 0.87,
          }),
        ]),
      })
    );
  });
});