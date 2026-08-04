import { findSimilarPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('類似顧客マッチング処理', () => {
  // SCEN-1558
  test('過去の類似顧客パターンデータが0件のとき、エラーが発生する', () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: 'IT',
      customerScale: 'large',
      dealAmount: 5000000,
      dealStage: 'negotiation',
    };

    expect(async () => {
      await findSimilarPatterns(dealCondition, mockAIEngine);
    }).toThrow(/PatternNotFound/);
  });
});