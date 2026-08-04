import { extractSuccessPatterns } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・構造化機能', () => {
  // SCEN-2462
  test('成功要因が0件の場合、空のテンプレート構造が生成される', () => {
    // Arrange: AIRecommendationEngineのスタブを作成
    const aiEngineStub = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      customerId: 'CUST-001',
      dealConditions: {
        industry: 'IT',
        companySize: 'enterprise',
        productCategory: 'cloud_solution',
        budgetRange: 'high',
      },
      aiEngine: aiEngineStub,
    };

    const fixedTimestamp = '2024-01-15T11:00:00Z';
    const dateNowSpy = jest.spyOn(global, 'Date').mockImplementation(
      () => new Date(fixedTimestamp) as any
    );

    // Act
    const result = extractSuccessPatterns(input);

    // Assert
    expect(result).toEqual({
      patterns: [],
      metadata: {
        totalCount: 0,
        extractedAt: fixedTimestamp,
        sourceCount: 0,
      },
      structure: {
        successFactors: [],
        commonCharacteristics: [],
        applicableIndustries: [],
        recommendedApproaches: [],
      },
    });
    expect(aiEngineStub.findSimilarPatterns).toHaveBeenCalledWith(
      input.dealConditions
    );

    dateNowSpy.mockRestore();
  });
});