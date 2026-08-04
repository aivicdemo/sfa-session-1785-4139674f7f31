import { calculateRecommendationTrustScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-862: [edge] 推奨信頼度スコア算出機能 - 信頼度スコアが閾値0直上で算出される
  test('信頼度スコアが0.0001として算出され、閾値超過と判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.0001),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      dealSize: 5000000,
      proposalContent: 'クラウド導入支援',
      salesStageKey: 'initial_contact',
    };

    const trustScore = calculateRecommendationTrustScore(
      dealCondition,
      mockAIEngine
    );

    expect(trustScore).toBe(0.0001);
    expect(trustScore).toBeGreaterThan(0);
    expect(trustScore).toBeLessThan(1);

    const thresholdMinimum = 0;
    const isAboveThreshold = trustScore > thresholdMinimum;
    expect(isAboveThreshold).toBe(true);

    const isValidCandidate = trustScore > 0;
    expect(isValidCandidate).toBe(true);

    const floatingPointError = Math.abs(trustScore - 0.0001);
    expect(floatingPointError).toBeLessThan(Number.EPSILON * 10);
  });
});