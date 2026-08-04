import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("Past Deal Success Pattern Extraction and Recommendation (SCEN-215)", () => {
  // SCEN-215
  test("should throw ValidationError when customerId is null in new deal data", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealData = {
      customerId: null,
      dealAmount: 5000000,
      industry: "Manufacturing",
      proposalContent: "DX Implementation Support",
      dealStage: "Initial Contact",
      companySize: "Large",
    };

    expect(() => generateRecommendation(newDealData, mockAIEngine)).toThrow(
      /顧客ID/
    );

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});