import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2008
  test("経営層向け説得資料の自動生成機能 - 改善提案の実行可能性スコアが範囲外（100を超える）のとき、資料生成がエラーになる", async () => {
    const { generateExecutivePersuasionMaterial } = await import(
      "../../src/logic/it-1-br-3-1-1-1"
    );

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        feasibilityScore: 101,
        pattern_id: "pattern_001",
        relevance_details: "Out of range",
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const input_customer_info = {
      customer_name: "テスト顧客A",
      industry: "製造業",
      customer_id: "cust_12345",
    };

    const input_proposal_content = {
      proposal_type: "システム導入",
      proposal_id: "prop_67890",
      description: "ERP導入提案",
    };

    const input_analysis_result = {
      proposal_feasibility: 101,
      investment_return_ratio: 2.5,
      risk_factors: ["実装リスク", "変更管理リスク"],
      improvement_suggestions: [
        {
          suggestion_id: "sugg_001",
          content: "段階的な導入",
          feasibility_score: 101,
        },
      ],
    };

    try {
      await generateExecutivePersuasionMaterial(
        input_customer_info,
        input_proposal_content,
        input_analysis_result,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      );
      expect(true).toBe(false);
    } catch (error) {
      const err = error as Error & {
        code?: string;
        message?: string;
        details?: {
          errorCode: string;
          feasibilityScore: number;
          validRange: string;
        };
      };

      expect(err.code || err.message).toMatch(
        /FEASIBILITY_SCORE_OUT_OF_RANGE/
      );

      expect(err.message).toMatch(
        /実行可能性スコアが有効範囲\（0～100\）を超えています/
      );
      expect(err.message).toMatch(/101/);

      expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();

      expect(err.details?.errorCode).toBe("FEASIBILITY_SCORE_OUT_OF_RANGE");
      expect(err.details?.feasibilityScore).toBe(101);
      expect(err.details?.validRange).toBe("0～100");
    }
  });
});