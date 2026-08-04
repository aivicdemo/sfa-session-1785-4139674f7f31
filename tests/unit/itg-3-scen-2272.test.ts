import { assembleReasoningInfo } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2272: 成功パターンレコードが存在しないとき、根拠情報の組み立てがエラーになる", () => {
    const dealId = "DEAL-TEST-001";
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      assembleReasoningInfo(dealId, mockAIEngine);
    }).toThrow(/参照可能な成功パターンレコード/);
  });
});