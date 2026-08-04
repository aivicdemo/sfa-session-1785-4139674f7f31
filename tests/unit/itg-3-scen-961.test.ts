import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-961
  test("推奨根拠情報が null のとき、根拠表示処理が開始されず警告が返される", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationInput = {
      recommendationId: "REC-2024-001",
      dealId: "DEAL-2024-0512",
      customerId: "CUST-12345",
      proposalContent: "提案テンプレートA",
    };

    const result = explainRecommendationReasoning(
      recommendationInput,
      mockAIEngine
    );

    expect(result).toEqual({
      status: 400,
      warningLevel: "HIGH",
      message: "推奨根拠情報の取得に失敗しました。根拠の詳細表示ができません",
      displayVisible: false,
      logEntry:
        "RecommendationReasoningNullError: explainRecommendationReasoning returned null for recommendationId: REC-2024-001",
    });

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationInput
    );
  });
});