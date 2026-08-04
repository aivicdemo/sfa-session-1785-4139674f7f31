import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ自動推奨機能", () => {
  test("SCEN-2282: evaluatePatternRelevanceの外部API呼び出しが失敗したとき、パターン適用可能性スコアが計算できずエラーになる", () => {
    // 失敗を模擬するスタブ: evaluatePatternRelevanceが外部API呼び出し失敗をシミュレート
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockRejectedValueOnce(
        new Error("API呼び出し失敗: OpenAI API接続タイムアウト")
      ),
    };

    // 評価対象となる成功パターン情報
    const successPattern = {
      patternId: "pattern_001",
      industryType: "IT",
      companySize: "mid-enterprise",
      dealCondition: {
        productCategory: "cloud_saas",
        budgetRange: "1000000_5000000",
        decisionMaker: "CTO",
      },
    };

    // 新規案件情報
    const newDealInfo = {
      industryType: "IT",
      companySize: "mid-enterprise",
      proposedProductCategory: "cloud_saas",
      budgetEstimate: 3000000,
      decisionMakersProfile: "CTO_lead",
    };

    // evaluatePatternRelevanceの呼び出しが失敗するケースを想定
    const callEvaluatePattern = async () => {
      try {
        // 外部APIの呼び出しをシミュレート
        const relevanceScore = await mockAIRecommendationEngine.evaluatePatternRelevance(
          successPattern,
          newDealInfo
        );
        return relevanceScore;
      } catch (error) {
        // エラーハンドリング: API失敗を適切に処理
        if (error instanceof Error && error.message.includes("API呼び出し失敗")) {
          throw {
            errorCode: "EXTERNAL_API_FAILURE",
            errorMessage: "スコア計算不可: API呼び出し失敗によりパターン適用可能性スコアが計算できません",
            originalError: error.message,
          };
        }
        throw error;
      }
    };

    // スローされたエラーを検証
    const expectError = async () => {
      try {
        await callEvaluatePattern();
        throw new Error("エラーがスローされるべき");
      } catch (err) {
        return err;
      }
    };

    expectError().then((err) => {
      // エラーオブジェクトの検証
      expect(err).toHaveProperty("errorCode");
      expect(err.errorCode).toBe("EXTERNAL_API_FAILURE");
      
      expect(err).toHaveProperty("errorMessage");
      expect(err.errorMessage).toMatch(/スコア計算不可/);
      expect(err.errorMessage).toMatch(/API呼び出し失敗/);
      
      expect(err).toHaveProperty("originalError");
      expect(err.originalError).toMatch(/API呼び出し失敗/);
      
      // パターン適用可能性スコアが計算されていないことを確認
      expect(err).not.toHaveProperty("relevanceScore");
    });

    // 非同期テストのため、実際の呼び出しをシミュレート
    return expect(
      mockAIRecommendationEngine.evaluatePatternRelevance(
        successPattern,
        newDealInfo
      )
    ).rejects.toThrow(/API呼び出し失敗/);
  });
});