import { explainRecommendationReasoning } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-975
  test('提案内容の金額が負数のとき、不正値エラーが返される', async () => {
    const mockRecommendation = {
      recommendationId: 'rec-12345',
      customerId: 'cust-67890',
      proposalAmount: -50000,
      proposalContent: 'システム導入提案',
      successPatternId: 'pattern-001',
      recommendationScore: 85,
      generatedAt: '2024-01-15T11:00:00Z',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockRejectedValue({
        statusCode: 400,
        errorCode: 'INVALID_AMOUNT',
        errorMessage: '提案内容の金額は0以上の値である必要があります。負数は許可されていません。',
        errorDetails: {
          detectedAmount: -50000,
        },
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    try {
      await explainRecommendationReasoning(mockRecommendation, mockAIEngine);
      fail('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.statusCode).toBe(400);
      expect(error.errorCode).toBe('INVALID_AMOUNT');
      expect(error.errorMessage).toMatch(/金額/);
      expect(error.errorDetails.detectedAmount).toBe(-50000);
    }
  });
});