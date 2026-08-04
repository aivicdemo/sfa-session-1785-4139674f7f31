import { generateRecommendationApproach } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨生成機能", () => {
  // SCEN-955
  test("商談IDが空文字列のとき、推奨生成処理が開始されず警告が返される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealInput = {
      dealId: "",
      customerId: "CUST-12345",
      customerIndustry: "IT",
      customerScale: "large",
      dealAmount: 5000000,
      dealStage: "initial_contact",
      dealDescription: "クラウド導入検討",
    };

    const result = generateRecommendationApproach(
      dealInput,
      mockAIRecommendationEngine
    );

    expect(result.errorCode).toBe("INVALID_DEAL_ID");
    expect(result.message).toBe("商談IDが空です。推奨を生成できません");
    expect(result.isWarning).toBe(true);
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});