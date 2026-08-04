import { calculateDeviationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 提案内容と標準プロセスの乖離度算出', () => {
  test('SCEN-2102: 標準プロセスデータが null のとき、エラーが発生する', () => {
    const proposalContent = {
      proposalId: 'PROP-001',
      content: '営業方法A',
      confidence: 0.85,
    };

    expect(() =>
      calculateDeviationScore(proposalContent, null)
    ).toThrow(/標準プロセスデータ/);
  });
});