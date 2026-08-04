import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1680: [error] 推奨根拠可視化機能 - 根拠の信頼度スコアが100を超えるとき、エラーが発生する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(100.5),
    };

    const dealCondition = {
      customerName: 'テスト太郎',
      industry: 'IT',
      budget: 5000000,
      dealId: 'deal_001',
      stage: 'initial_contact',
    };

    expect(() =>
      visualizeRecommendationReasoning(dealCondition, mockAIEngine)
    ).toThrow(/trustworthiness score/);
  });
});