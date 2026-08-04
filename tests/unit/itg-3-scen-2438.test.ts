import { calculateRecommendationAccuracyScore } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-2438
  test('推奨精度スコア算出機能 - 推奨内容の根拠情報が1件のときスコア算出に反映される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationDataWithSingleReasoning = {
      recommendationId: 'REC-001',
      customerId: 'CUST-001',
      dealId: 'DEAL-001',
      proposedApproach: '顧客の課題解決に向けた提案アプローチ',
      reasoning: [
        {
          relevanceScore: 0.85,
          patternId: 'PATTERN-001',
          explanation: '過去成功事例との類似度が高い',
        },
      ],
      generatedAt: new Date('2024-01-15T11:00:00Z'),
    };

    const result = calculateRecommendationAccuracyScore(
      recommendationDataWithSingleReasoning,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      accuracyScore: 85,
      reasoningCount: 1,
      baseRelevanceScore: 0.85,
      isNormalized: true,
    });
  });
});