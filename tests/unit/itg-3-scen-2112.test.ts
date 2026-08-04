import { evaluateProposalDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2112: [error] 提案内容と標準プロセスの乖離度算出 - 乖離度の数値化結果が負数のとき、エラーが発生する
  test('提案内容と標準プロセスの乖離度が負数の場合、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
    };

    const proposalData = {
      proposalId: 'prop-001',
      customerId: 'cust-001',
      proposalContent: 'テスト提案内容',
      proposalApproach: 'アプローチA',
    };

    const standardProcess = {
      processId: 'proc-001',
      steps: ['ステップ1', 'ステップ2'],
      criteria: ['基準1', '基準2'],
    };

    expect(() =>
      evaluateProposalDeviation(proposalData, standardProcess, mockAIEngine)
    ).toThrow(/乖離度は0以上1以下の範囲である必要があります/);
  });
});