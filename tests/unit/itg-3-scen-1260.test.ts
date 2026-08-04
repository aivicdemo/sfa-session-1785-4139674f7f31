import { generateRecommendationWithValidation } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1260
  test('営業プロセス遵守度が欠落しているときに400エラーと適切なエラー詳細が返される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: 'sample_approach',
        confidenceScore: 85,
        reasoningBasis: 'sample_basis',
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('sample_reasoning'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.9),
    };

    const input = {
      customerInfo: {
        customerId: 'CUST001',
        industry: 'IT',
        scale: 'large',
      },
      dealCondition: {
        dealId: 'DEAL001',
        productCategory: 'software',
        expectedValue: 50000,
      },
      pastSuccessPatternMatchScore: 75,
      salesProcessComplianceScore: undefined,
    };

    expect(() =>
      generateRecommendationWithValidation(input, mockAIRecommendationEngine)
    ).toThrow(/営業プロセス遵守度/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});