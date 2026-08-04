import {
  evaluatePatternRelevance,
} from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し新規案件に推奨", () => {
  // SCEN-2744
  test("推奨精度が基準値未満のとき研修実施判定が不可になる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        relevanceScore: 0.45,
        isApplicable: false,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const result = evaluatePatternRelevance(
      {
        customerId: "CUST-001",
        industry: "製造業",
        companySize: "大企業",
        currentChallenge: "生産効率化",
        budget: 5000000,
      },
      {
        successPatternId: "PAT-2024-001",
        proposalApproach: "DXコンサル提案",
        targetDuration: 6,
        expectedOutcome: "原価削減30%",
      },
      mockAIEngine
    );

    expect(result.judgmentStatus).toBe("NOT_EXECUTABLE");
    expect(result.trainingRequired).toBe(false);
    expect(result.errorMessage).toMatch(/推奨精度.*基準値/);
    expect(result.relevanceScore).toBe(0.45);
    expect(result.canExecuteTraining).toBe(false);
  });
});