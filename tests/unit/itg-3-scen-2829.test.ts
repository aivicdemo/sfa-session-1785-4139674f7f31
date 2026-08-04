import { visualizeRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化・説明文生成', () => {
  // SCEN-2829
  test('推奨根拠の説明文長が500文字未満のとき、そのまま完全な文字列が返却される', () => {
    const mockExplanationText = 'これは400文字の説明文です。'.repeat(14) + 'これは400文字';
    const mockExplanationText400 = mockExplanationText.substring(0, 400);

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: mockExplanationText400
      }),
      evaluatePatternRelevance: jest.fn()
    };

    const recommendationId = 'REC-2024-001';
    const recommendationContext = {
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      proposalContent: 'Enterprise SaaS Solution',
      recommendedTiming: '2024-02-15'
    };

    const result = visualizeRecommendationReasoning(
      recommendationId,
      recommendationContext,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.explanation).toBe(mockExplanationText400);
    expect(result.explanation.length).toBe(400);
    expect(result.explanation[result.explanation.length - 1]).toBe(mockExplanationText400[399]);
    expect(result.isFullyDisplayed).toBe(true);
    expect(result.truncated).toBe(false);
  });
});