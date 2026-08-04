import { describe, test, expect, beforeEach } from "@jest/globals";
import { decideSalesGuidancePolicy } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能 - 営業指導方針決定", () => {
  // SCEN-544: [edge] 営業指導方針決定機能 - データ品質スコアが合格ライン51のとき指導方針が改善推奨になる
  test("データ品質スコア51（合格ライン）のとき、指導方針が改善推奨になること", () => {
    const dataQualityScore = 51;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationType: "improvement_suggested",
        confidence_score: 75,
        reasoning: "Data quality at threshold level requires improvement guidance",
        suggested_actions: [
          "Review data entry standards",
          "Conduct staff training on data accuracy",
        ],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = decideSalesGuidancePolicy(
      dataQualityScore,
      mockAIRecommendationEngine
    );

    expect(result.guidance_policy).toBe("improvement_suggested");
    expect(result.status).toBe("approved");
    expect(result.data_quality_score).toBe(51);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalled();
  });
});