import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けロジック", () => {
  // SCEN-2783
  test("成約結果の区分が欠けている商談レコードが含まれるとき、エラーを返す", () => {
    const dealRecords = [
      {
        dealId: "A",
        contractStatus: "成約",
        amount: 5000000,
      },
      {
        dealId: "B",
        contractStatus: null,
        amount: 3000000,
      },
      {
        dealId: "C",
        contractStatus: "失注",
        amount: 1000000,
      },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      extractSuccessPatterns(dealRecords, mockAIRecommendationEngine)
    ).toThrow(/成約結果|区分|レコードB/);
  });
});