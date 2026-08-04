import { calculateRecommendationAccuracyScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨精度スコア算出機能', () => {
  // SCEN-2450
  test('過去商談の成功率が複数件のときすべてが平均化される', () => {
    const pastDealScores = [0.85, 0.72, 0.93];
    const expectedAverageScore = (0.85 + 0.72 + 0.93) / 3;
    const expectedRoundedScore = Math.round(expectedAverageScore * 100) / 100;

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((condition) => {
          const scoreIndex = [
            JSON.stringify({ type: 'dealA' }),
            JSON.stringify({ type: 'dealB' }),
            JSON.stringify({ type: 'dealC' }),
          ].indexOf(JSON.stringify(condition));
          return scoreIndex >= 0 ? pastDealScores[scoreIndex] : 0;
        }),
    };

    const newProjectCondition = {
      customerIndustry: 'finance',
      dealAmount: 5000000,
      proposalType: 'platform_solution',
    };

    const result = calculateRecommendationAccuracyScore(
      newProjectCondition,
      [
        { type: 'dealA' },
        { type: 'dealB' },
        { type: 'dealC' },
      ],
      mockAIEngine
    );

    expect(result.accuracyScore).toBe(expectedRoundedScore);
    expect(result.dealCountUsed).toBe(3);
    expect(result.accuracyScore).toBeCloseTo(0.83, 2);
  });
});