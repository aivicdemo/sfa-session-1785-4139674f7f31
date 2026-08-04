import { evaluateProposalDeviation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案内容と標準プロセスの乖離度算出", () => {
  test("SCEN-2115: 成功パターンマッチ度が100を超える値のときエラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(101),
    };

    const proposalInput = {
      customerId: "CUST-001",
      productCategory: "Enterprise Software",
      proposalContent: "Cloud migration with cost optimization",
      industryType: "Manufacturing",
      companySize: "Large",
    };

    expect(() => {
      evaluateProposalDeviation(proposalInput, mockAIEngine);
    }).toThrow(/マッチ度|範囲|PATTERN_MATCH_OUT_OF_RANGE/);
  });
});