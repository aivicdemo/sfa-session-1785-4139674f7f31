import { evaluateProposalConstraintCompliance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案内容と顧客制約条件の照合', () => {
  // SCEN-1329
  test('予算制約値が0のときに照合判定が適切に処理される', () => {
    const customerConstraints = {
      budgetConstraint: 0,
      otherConstraints: {
        期間: '3ヶ月',
        業種: 'IT'
      }
    };

    const proposalContent = {
      提案額: 500000,
      期間: '3ヶ月',
      業種: 'IT'
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn()
    };

    const result = evaluateProposalConstraintCompliance(
      proposalContent,
      customerConstraints,
      mockAIEngine
    );

    expect(result).toEqual({
      isCompliant: false,
      violatedConstraints: ['budgetConstraint'],
      reason: '予算制約が0に設定されているため、提案額500000円との照合に失敗'
    });
  });
});