import { generateRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1854
  test("根拠となる過去事例の日付が null のとき根拠情報の生成に失敗する", () => {
    const pastCaseWithNullDate = {
      eventId: "CASE-20240115-001",
      transactionDate: null,
      customerId: "CUST-2024-100",
      industry: "manufacturing",
      companySize: "large",
      proposalContent: "ERP導入支援",
      successFlag: true,
    };

    const newDealData = {
      customerId: "CUST-2024-200",
      industry: "manufacturing",
      companySize: "large",
      dealStage: "initial_proposal",
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => [pastCaseWithNullDate]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      generateRecommendationReasoning(newDealData, mockAIEngine)
    ).toThrow(/根拠となる過去事例の日付が不正です。事例ID: CASE-20240115-001/);
  });
});