import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1018
  test('推奨根拠が1項目の場合、その根拠が営業担当者向けに説明文として生成される', () => {
    const recommendationData = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      dealId: 'deal-456',
      proposedApproach: '提案アプローチA',
      confidenceScore: 85,
      rationales: ['顧客の業種が過去成功事例と一致'],
      successPatternId: 'pattern-789',
      createdAt: new Date('2024-01-15T10:30:00Z'),
    };

    const mockAiRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        'この顧客は過去の成功事例と同じ製造業界であり、同じ提案アプローチが有効と考えられます'
      ),
      evaluatePatternRelevance: jest.fn(),
    };

    const explanation = explainRecommendationReasoning(
      recommendationData.rationales,
      recommendationData.customerId,
      recommendationData.dealId,
      mockAiRecommendationEngine
    );

    expect(explanation).toBe(
      'この顧客は過去の成功事例と同じ製造業界であり、同じ提案アプローチが有効と考えられます'
    );
    expect(mockAiRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationData.rationales,
      recommendationData.customerId,
      recommendationData.dealId
    );
  });
});