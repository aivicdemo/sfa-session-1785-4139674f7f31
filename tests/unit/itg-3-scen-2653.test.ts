import {
  generateRecommendation,
} from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨ロジック - マッチングされた成功パターンが不正形式のとき", () => {
  test("SCEN-2653: 不正形式のパターンがマッチングされた場合、バリデーションエラーをスロー", () => {
    const newDealData = {
      customerId: "CUST-001",
      customerIndustry: "製造業",
      dealAmount: 5000000,
      dealStage: "提案準備",
      customerScale: "大企業",
    };

    const invalidPattern = {
      relevanceScore: "85",
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(() => [invalidPattern]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fallbackPatternMaster = [
      {
        patternId: "PAT-FB-001",
        patternName: "標準提案アプローチ",
        applicableIndustries: ["製造業", "流通業"],
        successRate: 0.72,
        recommendedActions: [
          "顧客課題のヒアリング",
          "業界標準ソリューション提案",
        ],
      },
      {
        patternId: "PAT-FB-002",
        patternName: "経営課題重視アプローチ",
        applicableIndustries: ["金融業", "製造業"],
        successRate: 0.68,
        recommendedActions: ["経営層への提案", "ROI試算"],
      },
    ];

    expect(() => {
      generateRecommendation(
        newDealData,
        aiRecommendationEngineStub,
        fallbackPatternMaster
      );
    }).toThrow(/不正形式|バリデーション/);
  });
});