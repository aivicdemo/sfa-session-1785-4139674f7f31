import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨生成機能', () => {
  // SCEN-956
  test('商談ステータスが不正値のとき、推奨生成処理が開始されず警告が返される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const invalidStatuses = [null, undefined, '', 'INVALID_STATUS'];

    invalidStatuses.forEach((invalidStatus) => {
      jest.clearAllMocks();

      const dealRequest = {
        dealId: 'DEAL-001',
        customerId: 'CUST-001',
        dealStatus: invalidStatus,
        customerIndustry: 'IT',
        customerSize: 'large',
        dealAmount: 5000000,
      };

      const result = generateRecommendation(
        dealRequest,
        mockAIEngine,
        mockLogger
      );

      expect(result.statusCode).toBe(400);
      expect(result.errorMessage).toMatch(/商談ステータス/);
      expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('バリデーション')
      );
    });
  });
});