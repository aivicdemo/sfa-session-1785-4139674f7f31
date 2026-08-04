import { describe, test, expect, beforeEach } from "@jest/globals";
import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1789
  test("推奨根拠の可視化機能 - 根拠に含まれる過去事例が時系列順に並ぶ", () => {
    // Setup: AIRecommendationEngine stub
    const mockSimilarPatterns = [
      {
        caseId: "CASE-001",
        dealDate: new Date("2024-01-15T00:00:00Z"),
        customerId: "CUST-100",
        industry: "IT",
        budgetRange: 500,
        relevanceScore: 92,
        successOutcome: true,
      },
      {
        caseId: "CASE-002",
        dealDate: new Date("2024-03-22T00:00:00Z"),
        customerId: "CUST-200",
        industry: "IT",
        budgetRange: 500,
        relevanceScore: 88,
        successOutcome: true,
      },
      {
        caseId: "CASE-003",
        dealDate: new Date("2024-02-10T00:00:00Z"),
        customerId: "CUST-300",
        industry: "IT",
        budgetRange: 500,
        relevanceScore: 85,
        successOutcome: true,
      },
    ];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue(mockSimilarPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newDeal = {
      customerId: "CUST-789",
      industry: "IT",
      budgetRange: 500,
    };

    // Execute: Call visualization function with stub
    const recommendationWithReasoning = visualizeRecommendationReasoning(
      newDeal,
      mockAIEngine
    );

    // Assert: Verify chronological order of past cases in reasoning
    expect(recommendationWithReasoning.reasoning).toBeDefined();
    expect(
      recommendationWithReasoning.reasoning.pastCasesReference
    ).toBeDefined();

    const pastCasesList =
      recommendationWithReasoning.reasoning.pastCasesReference;
    expect(pastCasesList).toHaveLength(3);

    // Verify chronological order: CASE-001 (2024-01-15) → CASE-003 (2024-02-10) → CASE-002 (2024-03-22)
    expect(pastCasesList[0].caseId).toBe("CASE-001");
    expect(pastCasesList[0].dealDate).toEqual(new Date("2024-01-15T00:00:00Z"));
    expect(pastCasesList[0].relevanceScore).toBe(92);

    expect(pastCasesList[1].caseId).toBe("CASE-003");
    expect(pastCasesList[1].dealDate).toEqual(new Date("2024-02-10T00:00:00Z"));
    expect(pastCasesList[1].relevanceScore).toBe(85);

    expect(pastCasesList[2].caseId).toBe("CASE-002");
    expect(pastCasesList[2].dealDate).toEqual(new Date("2024-03-22T00:00:00Z"));
    expect(pastCasesList[2].relevanceScore).toBe(88);

    // Verify required fields are present for each case
    pastCasesList.forEach((caseItem: any) => {
      expect(caseItem).toHaveProperty("caseId");
      expect(caseItem).toHaveProperty("dealDate");
      expect(caseItem).toHaveProperty("relevanceScore");
    });

    // Verify chronological ordering via timestamp comparison
    for (let i = 0; i < pastCasesList.length - 1; i++) {
      expect(pastCasesList[i].dealDate.getTime()).toBeLessThan(
        pastCasesList[i + 1].dealDate.getTime()
      );
    }
  });
});