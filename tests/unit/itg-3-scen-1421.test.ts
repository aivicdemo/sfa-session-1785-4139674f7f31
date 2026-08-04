import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-1421
  test("過去商談データが0件のとき、AI推奨エンジンへの呼び出しが実行される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
    };

    const mockRecommendationResult = {
      approach: "顧客のデジタル化推進を支援するクラウド導入提案",
      reasoning: "同業種・同規模の過去成功事例から、コスト最適化と業務効率化が主要ニーズであることを抽出",
      confidence_score: 82,
    };

    mockAIEngine.generateRecommendation.mockResolvedValueOnce(
      mockRecommendationResult
    );

    const newDealInput = {
      customer_name: "株式会社テック商事",
      industry: "製造業",
      company_size: "中堅企業",
      budget_range: "5000万円～1億円",
      business_challenge: "既存レガシーシステムの刷新とデジタル化推進",
      sales_stage: "初期接触",
    };

    const result = await generateRecommendation(newDealInput, mockAIEngine);

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealInput
    );
    expect(result).toEqual({
      approach: "顧客のデジタル化推進を支援するクラウド導入提案",
      reasoning:
        "同業種・同規模の過去成功事例から、コスト最適化と業務効率化が主要ニーズであることを抽出",
      confidence_score: 82,
    });
  });
});