import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1467: 購買履歴データ品質判定機能 - 提案内容が欠けているときエラーを返す", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        customerId: "CUST-001",
        proposalContent: null,
        recommendationReasoning: "過去成功パターンに基づいた推奨",
        confidenceScore: 85,
        successPatterns: [
          {
            patternId: "PATTERN-001",
            industry: "IT",
            description: "IT業界大規模企業の導入パターン"
          }
        ]
      })
    };

    const purchaseHistory = [
      {
        transactionDate: "2024-01-15",
        productCategory: "クラウドサービス",
        amount: 500000
      }
    ];

    const dealConditions = {
      customerIndustry: "IT",
      customerSize: "large",
      productCategory: "クラウドサービス"
    };

    const pastSuccessPatterns = [
      {
        patternId: "PATTERN-001",
        successRate: 0.92,
        applicableIndustries: ["IT"]
      }
    ];

    const result = await generateRecommendation(
      mockAIEngine,
      purchaseHistory,
      dealConditions,
      pastSuccessPatterns
    );

    expect(result).toEqual({
      success: false,
      errorCode: "PROPOSAL_CONTENT_MISSING",
      errorMessage: "提案内容が不足しています。AIエンジンから有効な提案データを取得できませんでした",
      statusCode: 400,
      fallbackRecommendation: {
        source: "internal_pattern_master",
        topPatterns: [
          {
            patternId: "PATTERN-001",
            successRate: 0.92,
            applicableIndustries: ["IT"],
            rank: 1
          }
        ]
      }
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      purchaseHistory,
      dealConditions,
      pastSuccessPatterns
    );
  });
});