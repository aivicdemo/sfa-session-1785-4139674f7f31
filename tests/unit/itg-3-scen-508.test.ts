import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type { AIRecommendationEngine } from "../../src/logic/itg-3";
import type { FileStorageAdapter } from "../../src/logic/itg-3";
import { determineGuidancePolicy } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 指導方針決定機能", () => {
  let mockAIEngine: jest.Mocked<AIRecommendationEngine>;
  let mockFileStorage: jest.Mocked<FileStorageAdapter>;

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-508
  test("should throw ValidationError when guidance_content is empty string", () => {
    const sales_person_id = "SA001";
    const business_conditions = {
      customer_industry: "製造業",
      budget_amount: 5000000,
      deal_stage: "提案段階",
      customer_size: "大企業",
    };
    const guidance_content = "";

    expect(() =>
      determineGuidancePolicy(
        sales_person_id,
        business_conditions,
        guidance_content,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/指導内容/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});