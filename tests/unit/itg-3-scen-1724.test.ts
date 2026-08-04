import { evaluateRecommendationValidity } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  test('SCEN-1724: 推奨時期が過去の日付のとき推奨スコアを減点補正する', () => {
    const currentDate = new Date('2024-01-15T11:00:00Z');
    const recommendedDateSevenDaysAgo = new Date('2024-01-08T11:00:00Z');

    const aiEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(75),
    };

    const testData = {
      customerId: 'CUST001',
      dealId: 'DEAL001',
      customerIndustry: 'manufacturing',
      customerScale: 'large',
      recommendedDate: recommendedDateSevenDaysAgo,
      currentDate: currentDate,
      basePatternScore: 75,
    };

    const result = evaluateRecommendationValidity(testData, aiEngineStub);

    const daysDifference = Math.floor(
      (currentDate.getTime() - recommendedDateSevenDaysAgo.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    expect(daysDifference).toBe(7);
    expect(result.adjustedScore).toBeLessThan(75);
    expect(result.adjustedScore).toBeGreaterThanOrEqual(63);
    expect(result.adjustedScore).toBeLessThanOrEqual(70);
    expect(result.deductionApplied).toBe(true);
    expect(result.deductionDays).toBe(7);
  });
});