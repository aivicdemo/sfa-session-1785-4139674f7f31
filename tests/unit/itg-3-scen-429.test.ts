import { decideDisciplinaryApproach } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  test('SCEN-429: [normal] 指導方針決定機能 - スコア80点でランクAの場合、方針が「注意喚起」と決定される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: '標準プロセスに基づいた提案を推奨',
        confidence: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: '過去の成功事例と比較して適切な提案',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 80,
      }),
    };

    const inputParams = {
      dataQualityScore: 80,
      priorityRank: 'A',
    };

    const result = decideDisciplinaryApproach(inputParams, mockAIEngine);

    expect(result).toEqual({
      approach: '注意喚起',
      score: 80,
      rank: 'A',
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});