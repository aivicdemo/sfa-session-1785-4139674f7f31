import { evaluateDeviationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2113: 提案内容と標準プロセスの乖離度算出 - 乖離度が100を超える値のときエラーが発生する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(101.5),
    };

    const proposalApproach = {
      approach_id: "PA-001",
      recommendation_content: "提案アプローチA",
      reasoning_basis: "過去成功事例PA-100に基づく",
    };

    const businessContext = {
      deal_condition_id: "DC-001",
      customer_industry: "製造業",
      deal_stage: "提案段階",
    };

    const standardProcessDefinition = {
      process_id: "SP-001",
      expected_approach: "標準提案アプローチ",
      max_deviation_threshold: 100,
    };

    expect(() =>
      evaluateDeviationScore(
        proposalApproach,
        businessContext,
        standardProcessDefinition,
        mockAIRecommendationEngine
      )
    ).toThrow(/DEVIATION_EXCEEDS_MAX_THRESHOLD/);

    expect(() =>
      evaluateDeviationScore(
        proposalApproach,
        businessContext,
        standardProcessDefinition,
        mockAIRecommendationEngine
      )
    ).toThrow(/乖離度: 101.5/);
  });
});