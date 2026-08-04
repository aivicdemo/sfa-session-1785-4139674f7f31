import { generateRecommendationApproach } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨生成機能", () => {
  test("SCEN-948: 顧客情報が null のとき、推奨生成処理が開始されず警告が返される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
    };

    const dealCondition = {
      dealId: "DEAL-001",
      productCategory: "クラウド基盤",
      budget: 5000000,
      timeline: "Q2",
    };

    const result = generateRecommendationApproach(
      null,
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(result.status).toBe("error");
    expect(result.message).toBe(
      "顧客情報が入力されていません。推奨の生成を開始できません"
    );
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});