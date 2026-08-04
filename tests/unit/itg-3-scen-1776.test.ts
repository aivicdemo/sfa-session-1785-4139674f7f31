import { evaluateRecommendationReasoningDisplayPriority } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1776
  test('根拠表示優先度が0.49のとき根拠表示順序を低として分類する', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.49),
    };

    const recommendationInput = {
      customerId: 'CUST-001',
      industryType: 'IT',
      companyScale: 'LARGE',
      dealCondition: 'NEW_CONTRACT',
      recommendationReasoningScore: 0.49,
    };

    // Act
    const result = evaluateRecommendationReasoningDisplayPriority(
      recommendationInput,
      mockAIRecommendationEngine
    );

    // Assert
    expect(result.recommendationReasoning.displayPriorityRank).toBe('LOW');
    expect(result.recommendationReasoning.score).toBe(0.49);
  });
});