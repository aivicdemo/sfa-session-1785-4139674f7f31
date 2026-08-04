import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合・推奨機能", () => {
  // SCEN-1878
  test("新規案件の商談IDが空文字列のとき照合に失敗する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      dealId: "",
      customerId: "CUST-12345",
      productCategory: "Enterprise Software",
      budget: 500000,
      timeline: "2024-Q2",
      industry: "Manufacturing",
      companySize: "Large",
    };

    expect(() =>
      findSimilarPatterns(newDealData, mockAIEngine)
    ).toThrow(/商談ID|deal.*id|dealId/i);
  });
});