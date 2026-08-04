import { decideCounselingGuidance } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  // SCEN-429: [normal] 指導方針決定機能 - スコア80点でランクAの場合、方針が「注意喚起」と決定される
  test('should decide guidance policy as 注意喚起 when score is 80 and rank is A', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: '標準提案',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('test reasoning'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(85),
    };

    const inputData = {
      qualityScore: 80,
      improvementRank: 'A',
      salesDataQualityScoreFromReport: 80,
      improvementPriorityRankFromReport: 'A',
    };

    const result = decideCounselingGuidance(
      inputData,
      mockAIEngine
    );

    expect(result.guidance).toBe('注意喚起');
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});