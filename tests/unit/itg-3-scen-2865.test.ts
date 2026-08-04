import { evaluateRecommendationReliability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2865
  test('推奨内容検証判定機能 - 成約実績との相関係数が 1 を超えるとき、エラーを返す', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(1.05),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationPatternData = {
      patternId: 'pattern_001',
      customerId: 'cust_123',
      industry: 'IT',
      dealStage: 'proposal',
      correlationCoefficient: 1.05,
      successRate: 0.92,
      sampleSize: 150,
    };

    expect(() =>
      evaluateRecommendationReliability(
        recommendationPatternData,
        mockAIEngine
      )
    ).toThrow(/CORRELATION_EXCEEDS_MAX/);
  });
});