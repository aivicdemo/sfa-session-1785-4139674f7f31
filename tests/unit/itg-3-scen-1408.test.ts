import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1408
  test('[edge] 提案内容と顧客制約条件の自動照合機能 - 照合対象の実装期間と制約スケジュールの順序が逆のとき、正常に照合される', () => {
    const proposalData = {
      proposalId: 'PROP-001',
      implementationStartDate: new Date('2026-03-01T00:00:00Z'),
      implementationEndDate: new Date('2026-03-31T23:59:59Z'),
      proposedAmount: 5000000,
      description: 'システム導入提案'
    };

    const customerConstraintData = {
      customerId: 'CUST-001',
      constraintEndDate: new Date('2026-03-15T23:59:59Z'),
      constraintStartDate: new Date('2026-02-01T00:00:00Z'),
      budgetLimit: 10000000,
      description: '予算制約スケジュール'
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: 'PAT-001',
          similarity: 0.85,
          successRate: 0.92
        }
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const result = evaluateProposalConstraintAlignment(
      proposalData,
      customerConstraintData,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.overlapDetected).toBe(true);
    expect(result.overlapStartDate).toEqual(new Date('2026-03-01T00:00:00Z'));
    expect(result.overlapEndDate).toEqual(new Date('2026-03-15T23:59:59Z'));
    expect(result.alignmentStatus).toBe('制約条件との時間的競合あり');
    expect(result.hasConflict).toBe(true);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalled();
  });
});