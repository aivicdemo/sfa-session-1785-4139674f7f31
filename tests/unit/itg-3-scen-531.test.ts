import { calculateRank } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - 改善優先度ランク算出', () => {
  // SCEN-531
  test('実現可能性スコアが欠落しているときランク算出が失敗する', () => {
    const improvementProposal = {
      improvementEffectScore: 8.5,
      implementationDifficultyScore: 6.0,
      feasibilityScore: null,
      strategyAlignment: 7.2,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => calculateRank(improvementProposal, mockAIEngine)).toThrow(/実現可能性スコア/);
  });
});