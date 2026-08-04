import { validateCustomerInfoForm } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-597
  test('顧客情報入力フォーム検証機能 - 同じ入力データで2回実行しても同じ検証結果が得られる', () => {
    const customerInfoDataset = {
      customerName: '山田太郎',
      email: 'yamada@example.com',
      phoneNumber: '09012345678',
      industry: '製造業',
      employeeCount: '150名',
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedPattern: 'pattern_001',
        relevanceScore: 85,
        confidence: 0.92,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'pattern_001', similarity: 0.92 },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: 'Similar customer profile found in manufacturing sector',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        applicabilityScore: 0.88,
      }),
    };

    const firstValidationResult = validateCustomerInfoForm(
      customerInfoDataset,
      mockAIRecommendationEngine
    );

    const firstRecordedResult = {
      validationStatus: firstValidationResult.validationStatus,
      errorMessages: [...firstValidationResult.errorMessages],
      aiRecommendationEngineResult: {
        recommendedPattern: firstValidationResult.aiRecommendationEngineResult?.recommendedPattern,
        relevanceScore: firstValidationResult.aiRecommendationEngineResult?.relevanceScore,
        confidence: firstValidationResult.aiRecommendationEngineResult?.confidence,
      },
    };

    mockAIRecommendationEngine.generateRecommendation.mockClear();
    mockAIRecommendationEngine.findSimilarPatterns.mockClear();
    mockAIRecommendationEngine.explainRecommendationReasoning.mockClear();
    mockAIRecommendationEngine.evaluatePatternRelevance.mockClear();

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue({
      recommendedPattern: 'pattern_001',
      relevanceScore: 85,
      confidence: 0.92,
    });
    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValue([
      { patternId: 'pattern_001', similarity: 0.92 },
    ]);
    mockAIRecommendationEngine.explainRecommendationReasoning.mockResolvedValue({
      explanation: 'Similar customer profile found in manufacturing sector',
    });
    mockAIRecommendationEngine.evaluatePatternRelevance.mockResolvedValue({
      applicabilityScore: 0.88,
    });

    const secondValidationResult = validateCustomerInfoForm(
      customerInfoDataset,
      mockAIRecommendationEngine
    );

    const secondRecordedResult = {
      validationStatus: secondValidationResult.validationStatus,
      errorMessages: [...secondValidationResult.errorMessages],
      aiRecommendationEngineResult: {
        recommendedPattern: secondValidationResult.aiRecommendationEngineResult?.recommendedPattern,
        relevanceScore: secondValidationResult.aiRecommendationEngineResult?.relevanceScore,
        confidence: secondValidationResult.aiRecommendationEngineResult?.confidence,
      },
    };

    expect(firstRecordedResult.validationStatus).toBe(secondRecordedResult.validationStatus);
    expect(firstRecordedResult.errorMessages).toEqual(secondRecordedResult.errorMessages);
    expect(firstRecordedResult.aiRecommendationEngineResult).toEqual(
      secondRecordedResult.aiRecommendationEngineResult
    );
  });
});