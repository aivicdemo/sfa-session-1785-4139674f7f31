import { evaluateProposalProcessDeviation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2171: [edge] 提案プロセス乖離度の数値化 - 標準プロセスからの乖離度が 99.999% のとき、乖離スコアが 100 に丸められる
  test('提案プロセス乖離度が99.999%のとき乖離スコアが100に丸められる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.99999),
    };

    const deviationScore = evaluateProposalProcessDeviation(
      mockAIRecommendationEngine
    );

    expect(deviationScore).toBe(100);
  });
});