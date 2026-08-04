import { evaluateProposalProcessDivergence } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2174
  test('提案プロセス乖離度の数値化 - 複数提案の乖離度が個別に算出される', async () => {
    const proposalA = {
      proposalId: 'A',
      customerSize: 'large',
      industry: 'technology',
      proposalType: 'system_implementation',
      content: 'Enterprise system deployment for large corporation',
    };

    const proposalB = {
      proposalId: 'B',
      customerSize: 'medium',
      industry: 'manufacturing',
      proposalType: 'consulting',
      content: 'Management consulting for mid-size company',
    };

    const proposalC = {
      proposalId: 'C',
      customerSize: 'startup',
      industry: 'fintech',
      proposalType: 'saas_service',
      content: 'SaaS platform subscription for startup',
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn((proposalData) => {
        if (proposalData.proposalId === 'A') {
          return Promise.resolve(0.78);
        } else if (proposalData.proposalId === 'B') {
          return Promise.resolve(0.65);
        } else if (proposalData.proposalId === 'C') {
          return Promise.resolve(0.82);
        }
        return Promise.resolve(0);
      }),
    };

    const proposals = [proposalA, proposalB, proposalC];

    const result = await evaluateProposalProcessDivergence(proposals, mockAIEngine);

    expect(result).toEqual([
      { proposalId: 'A', divergenceScore: 0.78 },
      { proposalId: 'B', divergenceScore: 0.65 },
      { proposalId: 'C', divergenceScore: 0.82 },
    ]);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(1, proposalA);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(2, proposalB);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenNthCalledWith(3, proposalC);
  });
});