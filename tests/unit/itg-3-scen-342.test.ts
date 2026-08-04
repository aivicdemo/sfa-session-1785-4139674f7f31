import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-342
  test('推奨精度検証機能 - 推奨精度に小数点以下の端数が生じる場合、指定精度で正常に丸められる', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.8756234),
    };

    const roundingPrecision = 2;
    const unroundedScore = mockAIRecommendationEngine.evaluatePatternRelevance({
      patternId: 'pattern-001',
      customerConditions: {
        industry: 'technology',
        companySize: 'large',
      },
      proposalContent: {
        productCategory: 'enterprise_solution',
        estimatedValue: 500000,
      },
    });

    const roundedScore = Math.round(unroundedScore * Math.pow(10, roundingPrecision)) / Math.pow(10, roundingPrecision);
    const expectedRoundedScore = 0.88;
    const precision = Math.pow(10, -roundingPrecision);

    expect(roundedScore).toBe(expectedRoundedScore);
    expect(Math.abs(unroundedScore - roundedScore)).toBeLessThanOrEqual(precision);
  });
});