import { generateRecommendationBasis } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-2679
  test("推奨内容が0件のとき、根拠表示として「推奨なし」が出力される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInfo = {
      customerName: "テスト顧客A",
      industry: "製造業",
      companySize: "大企業",
      budget: 5000000,
      businessChallenge: "生産効率化",
    };

    const dealCondition = {
      dealId: "DEAL-001",
      dealStage: "初期接触",
      customerNeed: "コスト削減",
      competitorStatus: "競合なし",
      decisionTimeline: "3ヶ月以内",
    };

    const result = generateRecommendationBasis(
      customerInfo,
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(result).toEqual({
      recommendationCount: 0,
      basisDisplay: "推奨なし",
      details: [],
    });

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      customerInfo,
      dealCondition
    );
  });
});