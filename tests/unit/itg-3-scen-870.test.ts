import { calculateRecommendationConfidenceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し提案アプローチを推奨する機能', () => {
  // SCEN-870: [edge] 推奨信頼度スコア算出機能 - 過去成功パターン件数が複数件のとき信頼度スコアが累積される
  test('複数の成功パターンから信頼度スコアが累積される', () => {
    const mockSimilarPatterns = [
      {
        patternId: 'pattern_001',
        relevanceScore: 0.85,
        customerIndustry: '製造業',
        budgetRange: '5000万円以上',
        decisionMakerCount: 3
      },
      {
        patternId: 'pattern_002',
        relevanceScore: 0.90,
        customerIndustry: '製造業',
        budgetRange: '5000万円以上',
        decisionMakerCount: 3
      },
      {
        patternId: 'pattern_003',
        relevanceScore: 0.95,
        customerIndustry: '製造業',
        budgetRange: '5000万円以上',
        decisionMakerCount: 3
      }
    ];

    const mockApplicabilityScores = [0.80, 0.85, 0.92];

    const mockFindSimilarPatterns = jest.fn().mockReturnValue(mockSimilarPatterns);
    const mockEvaluatePatternRelevance = jest
      .fn()
      .mockImplementation((patternId: string) => {
        const indexMap: { [key: string]: number } = {
          pattern_001: 0,
          pattern_002: 1,
          pattern_003: 2
        };
        return mockApplicabilityScores[indexMap[patternId] ?? 0];
      });

    const mockExplainRecommendationReasoning = jest
      .fn()
      .mockReturnValue('複数の類似成功事例に基づく推奨');

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
      generateRecommendation: jest.fn()
    };

    const newBusinessCase = {
      customerIndustry: '製造業',
      budgetRange: '5000万円以上',
      decisionMakerCount: 3
    };

    const result = calculateRecommendationConfidenceScore(
      newBusinessCase,
      mockAIRecommendationEngine
    );

    const expectedCumulativeScore = 0.85 * 0.80 + 0.90 * 0.85 + 0.95 * 0.92;

    expect(result.confidenceScore).toBeCloseTo(2.419, 2);
    expect(result.confidenceScore).toBeGreaterThan(0.95);
    expect(result.confidenceScore).toBeLessThanOrEqual(1.0);

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newBusinessCase);
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockExplainRecommendationReasoning).toHaveBeenCalled();

    expect(result.reasoning).toContain('複数の類似成功事例に基づく推奨');
    expect(result.patternCount).toBe(3);
  });
});