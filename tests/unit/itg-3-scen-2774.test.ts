import { describe, test, expect, beforeEach } from "@jest/globals";
import { displayRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2774
  test("推奨に至った成功パターンの特徴量が根拠として営業担当者に表示される", () => {
    const successPatternFeatures = [
      "顧客の技術課題を初回商談で明確化すること",
      "導入検討期間が3ヶ月以内であること",
      "決裁者が技術部門の責任者であること",
    ];

    const naturallanguageExplanation =
      "過去の同業種成功事例では、初回商談で顧客の技術課題を詳しくヒアリングしたケースで成約率が85%に達しています。また決裁者が技術責任者の場合、導入検討期間は平均2.5ヶ月と短縮される傾向があります";

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: "提案アプローチA",
        successPatternFeatures: successPatternFeatures,
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockResolvedValue(naturallanguageExplanation),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCase = {
      customerIndustry: "製造業",
      dealAmount: 6000000,
      prospectType: "技術課題あり",
    };

    const result = displayRecommendationReasoning(newCase, mockAIEngine);

    expect(result.recommendationReason).toBe(naturallanguageExplanation);
    expect(result.successPatternFeatures).toEqual([
      "1. 顧客の技術課題を初回商談で明確化すること",
      "2. 導入検討期間が3ヶ月以内であること",
      "3. 決裁者が技術部門の責任者であること",
    ]);
    expect(result.successPatternFeatures.length).toBe(3);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(newCase);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalled();
  });
});