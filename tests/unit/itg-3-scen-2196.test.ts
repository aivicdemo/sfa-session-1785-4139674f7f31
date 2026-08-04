import { analyzeProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2196
  test('提案内容の標準プロセスとの照合 - 提案の各ステップが標準プロセスの順序と逆順で提示されているとき、ステップ順序の乖離が最大値で算出される', () => {
    const standardProcessSteps = ['step1', 'step2', 'step3', 'step4'];
    const standardPositions = { step1: 0, step2: 1, step3: 2, step4: 3 };

    const reversedProposalSteps = ['step4', 'step3', 'step2', 'step1'];
    const actualPositions = { step4: 0, step3: 1, step2: 2, step1: 3 };

    const deviationScore = analyzeProposalProcessDeviation(
      standardProcessSteps,
      reversedProposalSteps
    );

    const expectedMaxDeviation = 1.0;
    expect(deviationScore).toBe(expectedMaxDeviation);
  });
});