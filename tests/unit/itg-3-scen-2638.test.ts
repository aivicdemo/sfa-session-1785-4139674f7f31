import { displayRecommendationWithReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2638: 推奨内容と根拠情報のマッピングが矛盾するとき、表示エラーが発生する", () => {
    // Arrange: AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: "REC-001",
        content: "顧客ニーズに基づいたソリューション提案",
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue({
        recommendationId: "REC-002",
        reasoning: "過去の類似案件での成功事例",
      }),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customerId: "CUST-123",
      industry: "製造業",
      scale: "中堅企業",
    };

    // Act & Assert: 推奨内容根拠表示機能を呼び出し、エラーが発生することを確認
    expect(() =>
      displayRecommendationWithReasoning(customerInfo, mockAIEngine)
    ).toThrow(/推奨ID.*不一致|RecommendationMappingError|マッピング矛盾/);
  });
});