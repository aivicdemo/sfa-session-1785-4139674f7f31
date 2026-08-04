import { validateBusinessLogic } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動判定機能 - 顧客属性と商談条件の妥当性検証", () => {
  test("SCEN-2632: 業務上ありえない顧客属性と商談条件の組み合わせで判定エラーが発生する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0,
        applicability: false,
        reasoning: "顧客属性と商談条件の矛盾が検出されました",
      }),
    };

    const customerAttributes = {
      industry: "個人消費者",
      contractAmount: 50000000,
      contractPeriod: 36,
    };

    const dealConditions = {
      proposedProduct: "法人向けエンタープライズソリューション",
      deploymentScale: 1000,
    };

    expect(() =>
      validateBusinessLogic(
        customerAttributes,
        dealConditions,
        mockAIRecommendationEngine
      )
    ).toThrow(/顧客属性.*商談条件.*矛盾/);

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        industry: "個人消費者",
        contractAmount: 50000000,
        contractPeriod: 36,
      }),
      expect.objectContaining({
        proposedProduct: "法人向けエンタープライズソリューション",
        deploymentScale: 1000,
      })
    );

    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});