import { generateProposalApproach } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1139
  test("提案アプローチ生成機能 - AIエージェント呼び出しが正常に完了したとき、生成された提案アプローチと根拠を返却する", async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "提案アプローチ文字列",
        reasoning: "根拠説明文字列",
        confidenceScore: 0.85,
        relatedPatterns: ["パターンID1", "パターンID2"],
      }),
    };

    const newCaseCondition = {
      industry: "IT",
      companySize: "従業員1000名以上",
      challenge: "デジタル変革推進",
    };

    const result = await generateProposalApproach(
      newCaseCondition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendedApproach: "提案アプローチ文字列",
      reasoning: "根拠説明文字列",
      confidenceScore: 0.85,
      relatedPatterns: ["パターンID1", "パターンID2"],
    });
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newCaseCondition
    );
  });
});