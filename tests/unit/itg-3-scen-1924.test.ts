import { RecommendationReasoningVisualizer } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1924: 購買履歴件数が0件のときに空の根拠が返却される', () => {
    // Arrange
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '初回接触戦略',
        confidenceScore: 0,
        recommendedTiming: new Date('2024-01-15T11:00:00Z'),
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const visualizer = new RecommendationReasoningVisualizer(mockAIEngine);

    const customerData = {
      customerId: 'CUST-001',
      customerName: '株式会社ABC',
      industry: '製造業',
      scale: '中規模',
      purchaseHistory: [],
      dealConditions: {
        budget: 5000000,
        timeline: '2024-Q2',
        requiredFeatures: ['機能A'],
      },
    };

    // Act
    const result = visualizer.visualizeRecommendationReasons(customerData);

    // Assert
    expect(result.reasons).toHaveLength(0);
    expect(Array.isArray(result.reasons)).toBe(true);
    expect(result.reasons).toEqual([]);
    expect(result.hasContent).toBe(false);
    expect(result.displayMessage).toBe('推奨の根拠がありません');
    expect(result.schema).toEqual({
      reasons: [],
      hasContent: false,
      displayMessage: '推奨の根拠がありません',
    });
  });
});