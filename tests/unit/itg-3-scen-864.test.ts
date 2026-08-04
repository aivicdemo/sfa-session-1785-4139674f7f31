import { evaluateRecommendationConfidence } from '../../src/logic/it-1-br-3-1-1-1';

jest.mock('../../src/logic/AIRecommendationEngine', () => ({
  evaluatePatternRelevance: jest.fn(),
}));

describe('推奨根拠の可視化機能 - 推奨信頼度スコア算出', () => {
  test('SCEN-864: 信頼度スコアが閾値100直下で算出される', async () => {
    const { evaluatePatternRelevance } = require('../../src/logic/AIRecommendationEngine');

    evaluatePatternRelevance.mockResolvedValue(99.9);

    const dealCondition = {
      customerIndustry: '製造業',
      dealScale: '中規模',
      budgetRange: 50000000,
    };

    const confidenceScore = await evaluateRecommendationConfidence(dealCondition);

    expect(confidenceScore).toBeLessThan(100);
    expect(confidenceScore).toBe(99.9);
  });
});