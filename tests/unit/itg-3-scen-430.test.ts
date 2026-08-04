import { decideSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-430
  test('指導方針決定機能 - スコア50点でランクCの場合、方針が「直接指導」と決定される', () => {
    const qualityScore = 50;
    const dataQualityRank = 'C';

    const stubAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(50),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = decideSalesGuidancePolicy(
      { qualityScore, dataQualityRank },
      stubAIEngine
    );

    expect(result.guidancePolicy).toBe('直接指導');
    expect(result.recommendedPatternMasterId).toBe('C-50');
  });
});