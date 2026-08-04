import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能", () => {
  // SCEN-1090
  test("営業担当者のユーザーIDが空文字列のとき、推奨生成処理がエラーになる", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const invalidUserIdInput = {
      userId: "",
      customerInfo: {
        companyName: "テスト株式会社",
        industry: "IT",
        employeeCount: 150,
      },
      dealCondition: {
        dealAmount: 5000000,
        dealStage: "提案準備",
        expectedCloseDate: "2024-06-30",
      },
    };

    expect(() =>
      generateRecommendation(invalidUserIdInput, mockAIEngine)
    ).toThrow(/ユーザーID/);
  });
});