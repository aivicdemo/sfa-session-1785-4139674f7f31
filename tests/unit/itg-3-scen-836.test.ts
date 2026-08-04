import { evaluateRecommendationConfidence } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-836: 信頼度スコアが100を超える場合、バリデーションエラーが発生して処理が中断される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(101.5),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationData = {
      customerId: 'CUST-001',
      dealId: 'DEAL-2024-001',
      proposedApproach: 'Technical Solution Package',
      successPatternId: 'SP-123',
      similarPatternCount: 5,
    };

    expect(() => {
      evaluateRecommendationConfidence(recommendationData, mockAIRecommendationEngine);
    }).toThrow(/信頼度スコア/);
  });
});