import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容の信頼度スコア算出・根拠提示機能', () => {
  test('SCEN-842: 成功パターンが空配列で返される場合、エラーハンドリングが実行される', async () => {
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      generateRecommendation: jest.fn(),
    };

    const newDealInput = {
      customerId: 'CUST-001',
      customerIndustry: '製造業',
      customerScale: 'large',
      dealCondition: '既存顧客との追加受注',
      dealAmount: 5000000,
      dealStage: 'proposal',
      requestId: 'REQ-20240115-001',
    };

    const expectedError = {
      code: 'NO_SIMILAR_PATTERNS_FOUND',
      message: '過去商談データから適用可能な成功パターンが見つかりませんでした',
      statusCode: 400,
    };

    await expect(
      generateRecommendation(newDealInput, mockAIRecommendationEngine)
    ).rejects.toEqual(expectedError);

    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealInput
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
  });
});