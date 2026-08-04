import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨内容の信頼度スコア算出・根拠提示機能", () => {
  test("SCEN-846: 類似度スコアが負数のとき、エラーで処理が進まない", () => {
    const newProjectData = {
      customerId: "CUST-001",
      industry: "製造業",
      companySize: "large",
      dealStage: "proposal",
      estimatedValue: 5000000,
    };

    const similarPatternWithNegativeScore = {
      patternId: "PAT-999",
      customerId: "CUST-100",
      industry: "製造業",
      companySize: "large",
      dealStage: "proposal",
      estimatedValue: 4800000,
      similarityScore: -0.5,
      successRate: 0.85,
      adoptionCount: 12,
    };

    expect(() =>
      evaluatePatternRelevance(newProjectData, similarPatternWithNegativeScore)
    ).toThrow(/類似度スコア/);
  });
});