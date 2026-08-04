import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1684
  test("推奨の詳細説明テキストが null のとき、エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      explainRecommendationReasoning: jest.fn().mockReturnValue(null),
    };

    const recommendationId = "REC-20240115-001";
    const customerInfo = {
      customerId: "CUST-12345",
      customerName: "テスト顧客",
      industry: "製造業",
      scale: "大企業",
    };

    expect(() => {
      explainRecommendationReasoning(
        recommendationId,
        customerInfo,
        mockAIRecommendationEngine
      );
    }).toThrow(/詳細説明|推奨|null/);
  });
});