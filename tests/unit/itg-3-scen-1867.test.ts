import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1867
  test('根拠の適用可能性スコアが null のとき根拠表示に失敗する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        patternId: 'pattern-001',
        applicabilityScore: null,
        confidence: 0.85,
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '過去の類似案件パターンに基づいた推奨です',
        reasoningDetails: ['顧客業種が一致', '商談規模が類似'],
      }),
    };

    const recommendationData = {
      patternId: 'pattern-001',
      customerId: 'cust-12345',
      dealAmount: 5000000,
      industry: 'manufacturing',
      applicabilityScore: null,
    };

    expect(() =>
      explainRecommendationReasoning(recommendationData, mockAIRecommendationEngine)
    ).toThrow(/適用可能性スコア/);
  });
});