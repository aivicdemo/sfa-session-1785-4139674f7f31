import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1669
  test('推奨スコア算出機能 - 推奨根拠データが null のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        score: 0,
        reason: '',
      }),
    };

    const nullRecommendationBasis = null;
    const dealId = 'DEAL-001';
    const proposalApproachId = 'APPROACH-001';

    expect(() =>
      calculateRecommendationScore(
        nullRecommendationBasis,
        dealId,
        proposalApproachId,
        mockAIRecommendationEngine
      )
    ).toThrow(/recommendationBasis/);
  });
});