import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨パターンランク付け機能 - 成功パターンのスコアが端数を含むとき正確に丸められてランク付けされる', () => {
  // SCEN-2355
  test('成功パターンのスコアが端数を含むとき、小数第1位で四捨五入されて正確にランク付けされる', () => {
    const mockPatterns = [
      {
        patternId: 'pattern_001',
        successScore: 87.456789,
        customerSegment: 'enterprise',
        dealStage: 'proposal',
        approachType: 'consultative',
      },
      {
        patternId: 'pattern_002',
        successScore: 87.234567,
        customerSegment: 'enterprise',
        dealStage: 'proposal',
        approachType: 'consultative',
      },
      {
        patternId: 'pattern_003',
        successScore: 87.654321,
        customerSegment: 'enterprise',
        dealStage: 'proposal',
        approachType: 'consultative',
      },
      {
        patternId: 'pattern_004',
        successScore: 87.5,
        customerSegment: 'enterprise',
        dealStage: 'proposal',
        approachType: 'consultative',
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputCustomerConditions = {
      industry: 'technology',
      companySize: 'large',
      budgetRange: 'high',
      decisionTimeframe: 'short',
    };

    return findSimilarPatterns(inputCustomerConditions, mockAIEngine).then(
      (rankedPatterns) => {
        expect(rankedPatterns).toHaveLength(4);

        // Verify first rank: 87.654321 → 87.7 (highest after rounding)
        expect(rankedPatterns[0]).toEqual(
          expect.objectContaining({
            patternId: 'pattern_003',
            successScore: 87.654321,
            roundedScore: 87.7,
            rank: 1,
          })
        );

        // Verify second rank: 87.456789 → 87.5
        expect(rankedPatterns[1]).toEqual(
          expect.objectContaining({
            patternId: 'pattern_001',
            successScore: 87.456789,
            roundedScore: 87.5,
            rank: 2,
          })
        );

        // Verify third rank: 87.5 → 87.5 (same rounded value as pattern_001, ordered by original score)
        expect(rankedPatterns[2]).toEqual(
          expect.objectContaining({
            patternId: 'pattern_004',
            successScore: 87.5,
            roundedScore: 87.5,
            rank: 3,
          })
        );

        // Verify fourth rank: 87.234567 → 87.2 (lowest after rounding)
        expect(rankedPatterns[3]).toEqual(
          expect.objectContaining({
            patternId: 'pattern_002',
            successScore: 87.234567,
            roundedScore: 87.2,
            rank: 4,
          })
        );

        // Verify that patterns with same rounded score are ordered by original score descending
        expect(rankedPatterns[1].successScore).toBeGreaterThan(
          rankedPatterns[2].successScore
        );
      }
    );
  });
});