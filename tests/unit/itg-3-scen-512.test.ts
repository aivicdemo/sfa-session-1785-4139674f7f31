import { validateScoreAndPriorityConsistency } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質検証', () => {
  // SCEN-512
  test('データ品質スコア95と改善優先度ランク1の矛盾時にValidationErrorが発生', () => {
    const testData = {
      qualityScore: 95,
      improvementPriorityRank: 1,
      recommendationId: 'rec_20240115_001',
      timestamp: new Date('2024-01-15T11:00:00Z'),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'sample_approach',
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    expect(() => {
      validateScoreAndPriorityConsistency(testData, mockAIEngine);
    }).toThrow(/データ品質スコア 95 は改善優先度ランク 1 と整合しません。スコア 95 に対応する改善優先度ランクは 3 以上である必要があります/);

    try {
      validateScoreAndPriorityConsistency(testData, mockAIEngine);
    } catch (error: unknown) {
      if (error instanceof Error && 'errorCode' in error) {
        expect((error as { errorCode: string }).errorCode).toBe('INCONSISTENT_QUALITY_PRIORITY');
      }
    }
  });
});