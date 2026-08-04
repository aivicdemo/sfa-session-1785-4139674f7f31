import {
  explainRecommendationReasoning,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1850
  test("推奨根拠レコードが0件のとき根拠情報の生成に失敗する", () => {
    const customerId = "CUST-001";
    const dealConditions = {
      industryType: "製造業",
      companySize: "中堅企業",
      budget: 5000000,
      timeframe: "3ヶ月以内",
    };
    const recommendationId = "REC-2024-001";

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockDatabase = {
      getRecommendationReasons: jest.fn().mockReturnValue([]),
      getRecommendationPatternMaster: jest.fn().mockReturnValue([
        {
          patternId: "PAT-001",
          description: "標準的な提案パターン",
          successRate: 0.72,
        },
      ]),
      logInternalFallback: jest.fn(),
    };

    let thrownError: any;
    try {
      explainRecommendationReasoning(
        customerId,
        dealConditions,
        recommendationId,
        mockAIEngine,
        mockDatabase
      );
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeDefined();
    expect(thrownError.message).toMatch(/推奨根拠レコードが見つかりません/);
    expect(thrownError.name).toBe("RecommendationReasoningNotFoundError");

    expect(mockDatabase.getRecommendationReasons).toHaveBeenCalledWith(
      recommendationId
    );
    expect(mockDatabase.getRecommendationReasons).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    expect(mockDatabase.getRecommendationPatternMaster).toHaveBeenCalledTimes(
      1
    );
    expect(mockDatabase.logInternalFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: recommendationId,
        customerId: customerId,
        fallbackReason: "推奨根拠レコードが見つかりません",
        simplifiedExplanation: expect.stringContaining("標準的な提案パターン"),
      })
    );

    const userMessage =
      "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します";
    expect(thrownError.userMessage).toBe(userMessage);
  });
});