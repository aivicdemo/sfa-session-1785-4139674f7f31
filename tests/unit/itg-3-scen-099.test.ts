import { recommendationExecution } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - データ品質検証と推論実行制御", () => {
  test("SCEN-099: データ品質が不良と判定された場合に推論実行が保留される", () => {
    const input_customer_name = "テスト顧客A";
    const input_industry = "製造業";
    const input_budget = "500万円";
    const input_budget_numeric = 5000000;

    const mockValidateDataQuality = jest.fn().mockReturnValue({
      is_valid: false,
      quality_score: 45,
      quality_threshold: 70,
      failed_items: ["customer_name_format", "industry_classification"],
    });

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockRequestStatusRepository = {
      save: jest.fn(),
    };

    const mockUINotificationService = {
      displayMessage: jest.fn(),
    };

    const new_deal_request = {
      customer_name: input_customer_name,
      industry: input_industry,
      budget: input_budget_numeric,
    };

    const result = recommendationExecution({
      deal_request: new_deal_request,
      validate_data_quality: mockValidateDataQuality,
      ai_recommendation_engine: mockAIRecommendationEngine,
      request_status_repository: mockRequestStatusRepository,
      ui_notification_service: mockUINotificationService,
    });

    expect(mockValidateDataQuality).toHaveBeenCalledWith(new_deal_request);
    expect(mockValidateDataQuality).toHaveBeenCalledTimes(1);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();

    expect(result.internal_status).toBe("PENDING_DATA_QUALITY_IMPROVEMENT");

    expect(mockUINotificationService.displayMessage).toHaveBeenCalledWith(
      "データ品質が不良です。入力項目を確認してください"
    );

    expect(mockRequestStatusRepository.save).toHaveBeenCalledWith({
      request_id: expect.any(String),
      status: "HELD",
      reason: "DATA_QUALITY_FAILED",
      quality_score: 45,
      failed_items: ["customer_name_format", "industry_classification"],
      timestamp: expect.any(String),
    });

    expect(result.recommendation_generated).toBe(false);
    expect(result.error_message).toBeUndefined();
  });
});