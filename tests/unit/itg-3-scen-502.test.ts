import { describe, test, expect } from '@jest/globals';
import { determineCoachingPolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定', () => {
  // SCEN-502
  test('改善優先度ランク情報が空配列のとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'sample_approach',
        confidence: 85,
        reasoning: 'Based on historical data'
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const emptyPriorityRanks = [];
    const dataQualityScore = 92;
    const improvementTargetItems = ['data_completeness', 'format_validation'];

    expect(() => {
      determineCoachingPolicy(
        {
          improvementPriorityRanks: emptyPriorityRanks,
          dataQualityScore: dataQualityScore,
          improvementTargetItems: improvementTargetItems
        },
        mockAIEngine
      );
    }).toThrow(/改善優先度ランク/);
  });
});