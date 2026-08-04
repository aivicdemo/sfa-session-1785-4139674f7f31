import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-238
  test("推奨根拠に紐付く商談詳細レコードが削除されている場合、エラーを返す", () => {
    const recommendationId = "rec-12345";
    const dealDetailRecordId = "deal-detail-99999";
    const errorMessage = "推奨根拠に紐付く商談詳細レコードが見つかりません";
    const errorCode = "REFERENCED_RECORD_NOT_FOUND";
    const expectedHttpStatus = 404;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoning: "過去の成功パターンに基づいた提案",
        relatedDealDetailId: dealDetailRecordId,
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockDealDetailRepository = {
      getDealDetailById: jest.fn().mockResolvedValue(null),
    };

    const mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };

    const result = visualizeRecommendationReasoning(
      {
        recommendationId,
        dealDetailRecordId,
      },
      mockAIRecommendationEngine,
      mockDealDetailRepository,
      mockLogger
    );

    expect(result).rejects.toEqual({
      errorCode,
      message: expect.stringContaining(errorMessage),
      statusCode: expectedHttpStatus,
      userFriendlyMessage: expect.stringContaining(
        "推奨根拠に紐付く商談詳細レコードが見つかりません。管理者に連絡してください"
      ),
    });

    expect(mockDealDetailRepository.getDealDetailById).toHaveBeenCalledWith(
      dealDetailRecordId
    );

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining("削除済み")
    );

    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});