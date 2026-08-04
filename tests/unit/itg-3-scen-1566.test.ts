import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("類似顧客マッチング処理 - 類似度閾値検証", () => {
  // SCEN-1566
  test("類似度スコアが100を超える場合、ValidationErrorをスロー", () => {
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue({
        similarityScore: 101.5,
        matchedPatterns: [],
      }),
    };

    const customerData = {
      customerId: "CUST-001",
      industry: "IT",
      companySize: "large",
      dealConditions: {
        estimatedValue: 5000000,
        dealStage: "proposal",
        timeline: "Q2",
      },
    };

    expect(() =>
      findSimilarPatterns(customerData, mockAIEngine)
    ).toThrow(/類似度閾値は100以下である必要があります|類似度スコアが無効な範囲です/);
  });
});