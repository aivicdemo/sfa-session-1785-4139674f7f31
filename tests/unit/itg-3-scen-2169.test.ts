import { calculateProposalProcessDeviationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2169
  test('提案プロセス乖離度の数値化 - 標準プロセスからの乖離度が0%直下のとき、乖離スコアが0に丸められる', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.00001),
    };

    const proposalProcessInput = {
      proposalContent: 'Test proposal content',
      customerAttributes: {
        industry: 'Technology',
        scale: 'Large Enterprise',
      },
      dealConditions: {
        dealStage: 'Negotiation',
        dealValue: 5000000,
      },
    };

    const result = calculateProposalProcessDeviationScore(
      proposalProcessInput,
      mockAIRecommendationEngine,
    );

    expect(result).toEqual({
      deviationScore: 0,
      deviationPercentage: 0.001,
      isWithinStandardProcess: true,
    });
  });
});