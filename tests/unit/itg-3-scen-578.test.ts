import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-578: 推奨根拠説明文生成機能 - 推奨根拠の信頼度が閾値0.7未満のとき説明文に注釈が付される", async () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.65,
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(
          "顧客の業種と過去成功事例が合致しており、提案アプローチはA社事例に基づいています"
        ),
    };

    const newCaseData = {
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealCondition: "新規営業",
      proposedApproach: "顧客課題解決型提案",
    };

    const result = await explainRecommendationReasoning(
      newCaseData,
      mockAIRecommendationEngine
    );

    const expectedAnnotation =
      "【注釈：信頼度が0.7未満のため、この推奨は参考情報です】";
    const expectedBaseExplanation =
      "顧客の業種と過去成功事例が合致しており、提案アプローチはA社事例に基づいています";
    const expectedResult = expectedAnnotation + expectedBaseExplanation;

    expect(result).toBe(expectedResult);
  });
});