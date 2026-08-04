import { decideGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  // SCEN-430
  test('スコア50点でランクCの場合、方針が「直接指導」と決定される', () => {
    const input_score = 50;
    const input_rank = 'C';
    const expected_policy = '直接指導';

    const stub_AIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(50),
    };

    const result_policy = decideGuidancePolicy(
      input_score,
      input_rank,
      stub_AIRecommendationEngine
    );

    expect(result_policy).toBe(expected_policy);
    expect(stub_AIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      input_score,
      input_rank
    );
  });
});