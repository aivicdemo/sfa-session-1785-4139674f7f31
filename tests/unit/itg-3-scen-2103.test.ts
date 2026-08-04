import { evaluateProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2103
  test('提案内容と標準プロセスの乖離度算出 - 標準プロセスデータが空文字列のとき、エラーが発生する', () => {
    const proposalContent = {
      customerName: 'Sample Corp',
      proposalApproach: 'Direct negotiation with management team',
      recommendedAction: 'Schedule C-level meeting',
    };

    const standardProcess = '';

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockImplementation(() => {
        throw new Error('標準プロセスデータが空です');
      }),
    };

    expect(() =>
      evaluateProposalDeviation(proposalContent, standardProcess, mockAIEngine)
    ).toThrow(/標準プロセスデータが空です/);
  });
});