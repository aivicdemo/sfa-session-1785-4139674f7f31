import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { extractSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

// Mock type definitions for AIRecommendationEngine
interface DealData {
  dealId: string;
  customerId: string;
  dealStatus: "success" | "failure";
  dealAmount: number;
  dealDate: string;
  industry: string;
  companySize: string;
}

interface FailurePattern {
  patternId: string;
  failureCauseCategory: string;
  matchingDealCount: number;
  extractedAt: string;
}

interface ExtractionResult {
  successPatterns: unknown[];
  failurePatterns: FailurePattern[];
}

describe("過去商談データからの成功パターン抽出機能", () => {
  let mockAIRecommendationEngine: {
    findSimilarPatterns: jest.Mock;
  };

  beforeEach(() => {
    // Initialize mock AI engine
    mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };
  });

  // SCEN-2584
  test("失敗した商談件数がちょうど閾値のとき、失敗パターンに含まれる", async () => {
    const FAILURE_COUNT_THRESHOLD = 10;
    const EXTRACTION_DATE = "2024-01-15T10:30:00Z";

    // Prepare test data: exactly 10 failed deals
    const failedDealsAtThreshold: DealData[] = Array.from(
      { length: FAILURE_COUNT_THRESHOLD },
      (_, index) => ({
        dealId: `DEAL_FAIL_${index + 1}`,
        customerId: `CUST_${index + 1}`,
        dealStatus: "failure" as const,
        dealAmount: 50000 + index * 1000,
        dealDate: "2023-12-01T09:00:00Z",
        industry: "Manufacturing",
        companySize: "Large",
      })
    );

    // Mock the findSimilarPatterns to return failure pattern extraction data
    const mockFailureExtractionData = {
      failureCategory: "inadequate_needs_analysis",
      relatedDeals: failedDealsAtThreshold,
      extractionTimestamp: EXTRACTION_DATE,
    };

    mockAIRecommendationEngine.findSimilarPatterns.mockResolvedValueOnce(
      mockFailureExtractionData
    );

    // Execute the extraction function with test dataset
    const result: ExtractionResult = await extractSuccessPatterns(
      failedDealsAtThreshold,
      mockAIRecommendationEngine
    );

    // Verify that the failure pattern is recorded in the result
    expect(result.failurePatterns).toHaveLength(1);

    const recordedFailurePattern = result.failurePatterns[0];

    // Verify all required fields are present and correct
    expect(recordedFailurePattern.patternId).toMatch(/^PATTERN_/);
    expect(recordedFailurePattern.failureCauseCategory).toBe(
      "inadequate_needs_analysis"
    );
    expect(recordedFailurePattern.matchingDealCount).toBe(
      FAILURE_COUNT_THRESHOLD
    );
    expect(recordedFailurePattern.extractedAt).toBe(EXTRACTION_DATE);

    // Verify the mock was called with correct parameters
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      failedDealsAtThreshold
    );
  });
});