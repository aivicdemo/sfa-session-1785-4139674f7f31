import { describe, test, expect, jest } from "@jest/globals";
import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-3-1-1-1";

// Mock AIRecommendationEngine
const mockAIRecommendationEngine = {
  generateRecommendation: jest.fn(),
  findSimilarPatterns: jest.fn(),
  explainRecommendationReasoning: jest.fn(),
  evaluatePatternRelevance: jest.fn(),
};

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1904
  test("顧客データが欠落しているときに推奨根拠の生成がスキップされる", () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Prepare test input with missing customer data
    const dealInfoWithMissingCustomerData = {
      deal_id: "DEAL-20240115-001",
      customer_id: "CUST-001",
      customer_name: null, // Missing required field
      industry: "", // Empty required field
      company_scale: "mid-market",
      deal_status: "negotiation",
      proposed_approach: "consultative_approach",
      recommendation_id: "REC-001",
    };

    // Call the visualization function with missing customer data
    const result = visualizeRecommendationRationale(
      dealInfoWithMissingCustomerData,
      mockAIRecommendationEngine
    );

    // Verify that explainRecommendationReasoning is NOT called (skipped)
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();

    // Verify that other AI methods are also NOT called (skipped)
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    // Verify the result contains error message indicating missing customer data
    expect(result).toEqual({
      success: false,
      rationale_text: null,
      error_message: /顧客データ/,
      has_external_api_call: false,
    });

    // Verify that no external API call was made
    expect(result.has_external_api_call).toBe(false);
  });
});