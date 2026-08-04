import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1652
  test('推奨タイミングが過去日時のとき、エラーが発生する', () => {
    const currentTime = new Date('2026-08-01T08:30:00Z');
    const pastRecommendationTiming = new Date('2026-08-01T08:00:00Z');

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customerId: 'CUST001',
      industry: '製造業',
      scale: '従業員100名',
    };

    const dealCondition = {
      dealId: 'DEAL001',
      dealStatus: '初期段階',
      productCategory: 'ソリューションA',
    };

    expect(() =>
      calculateRecommendationScore(
        {
          customerInfo,
          dealCondition,
          recommendationTiming: pastRecommendationTiming,
          currentTime,
        },
        mockAIRecommendationEngine
      )
    ).toThrow(/推奨タイミングは現在日時以降である必要があります/);
  });
});