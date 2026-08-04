import {
  visualizeRecommendationReasoning,
} from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠可視化機能", () => {
  // SCEN-233
  test("推奨根拠に含まれる過去商談IDが顧客マスタに存在しないときエラーになる", () => {
    const nonExistentDealId = "PD-99999";

    const recommendationReasoning = {
      recommendationId: "REC-001",
      customerId: "CUST-001",
      pastDealIds: [nonExistentDealId],
      successPatternName: "成功パターンA",
      reasoningText: "過去の類似案件に基づいて推奨しました",
      confidenceScore: 85,
    };

    const mockCustomerMaster = {
      findByDealId: jest.fn((dealId: string) => {
        if (dealId === nonExistentDealId) {
          return null;
        }
        return {
          dealId: dealId,
          customerName: "テスト顧客",
        };
      }),
    };

    expect(() =>
      visualizeRecommendationReasoning(
        recommendationReasoning,
        mockCustomerMaster
      )
    ).toThrow(/PD-99999/);
  });
});