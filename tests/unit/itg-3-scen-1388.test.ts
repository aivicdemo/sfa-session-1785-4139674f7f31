import { evaluateProposalConstraintAlignment } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1388: 提案金額が顧客予算制約を超過する場合、AIエンジンの評価結果が最終判定に反映される', () => {
    const customerConstraint = {
      budgetLimitYen: 5000000,
    };

    const proposalContent = {
      proposalAmountYen: 8000000,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        feasibilityScore: 1.0,
      }),
    };

    const result = evaluateProposalConstraintAlignment(
      proposalContent,
      customerConstraint,
      mockAIEngine
    );

    expect(result.feasibilityScore).toBe(1.0);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalContent,
      customerConstraint
    );
  });
});