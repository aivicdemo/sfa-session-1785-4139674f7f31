import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能", () => {
  // SCEN-2625
  test("商談条件が空のとき、ValidationErrorが発生する", () => {
    const emptyDealCondition = {};
    expect(() =>
      generateRecommendation({
        customerId: "CUST-001",
        dealCondition: emptyDealCondition,
        aiEngine: {
          generateRecommendation: jest.fn(),
          findSimilarPatterns: jest.fn(),
          explainRecommendationReasoning: jest.fn(),
          evaluatePatternRelevance: jest.fn(),
        },
        patternMaster: {
          getPatterns: jest.fn(),
        },
      })
    ).toThrow(/商談条件/);
  });
});