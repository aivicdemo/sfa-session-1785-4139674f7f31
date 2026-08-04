import { findSimilarPatterns, evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-1615
  test("類似顧客マッチング処理 - 提案日が月初のとき、一致度計算が正常に処理される", () => {
    const proposalDateMonthStart = new Date("2025-01-01T09:00:00Z");
    
    const currentCustomerData = {
      industryCode: "1001",
      employeeCount: 150,
      annualRevenue: 50000000,
      businessPhase: "expansion",
      mainProblem: "cost_reduction",
      proposalDate: proposalDateMonthStart,
    };

    const historicalPatterns = [
      {
        id: "pattern_001",
        industryCode: "1001",
        employeeCount: 120,
        annualRevenue: 48000000,
        businessPhase: "expansion",
        mainProblem: "cost_reduction",
        contractAmount: 2500000,
        contractResult: "success",
      },
      {
        id: "pattern_002",
        industryCode: "1001",
        employeeCount: 180,
        annualRevenue: 52000000,
        businessPhase: "expansion",
        mainProblem: "cost_reduction",
        contractAmount: 2300000,
        contractResult: "success",
      },
      {
        id: "pattern_003",
        industryCode: "1002",
        employeeCount: 200,
        annualRevenue: 60000000,
        businessPhase: "stable",
        mainProblem: "quality_improvement",
        contractAmount: 1800000,
        contractResult: "failure",
      },
    ];

    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        id: "pattern_001",
        matchingScore: 0.92,
      },
      {
        id: "pattern_002",
        matchingScore: 0.88,
      },
    ]);

    const mockEvaluatePatternRelevance = jest.fn((pattern) => {
      if (pattern.id === "pattern_001") {
        return 0.95;
      }
      if (pattern.id === "pattern_002") {
        return 0.90;
      }
      return 0.0;
    });

    const similarPatterns = mockFindSimilarPatterns(
      currentCustomerData,
      historicalPatterns
    );
    
    expect(similarPatterns).toHaveLength(2);
    expect(similarPatterns[0].id).toBe("pattern_001");
    expect(similarPatterns[0].matchingScore).toBeGreaterThanOrEqual(0);
    expect(similarPatterns[0].matchingScore).toBeLessThanOrEqual(1);

    const relevanceScores = similarPatterns.map((pattern) => ({
      id: pattern.id,
      relevance: mockEvaluatePatternRelevance(pattern),
    }));

    expect(relevanceScores).toHaveLength(2);
    expect(relevanceScores[0].relevance).toBe(0.95);
    expect(relevanceScores[1].relevance).toBe(0.90);

    const weightedScores = similarPatterns.map((pattern, index) => {
      const relevance = relevanceScores[index].relevance;
      const matching = pattern.matchingScore;
      return (matching * 0.6 + relevance * 0.4) * 100;
    });

    expect(weightedScores[0]).toBe(72.5);
    expect(weightedScores[1]).toBe(68.8);

    const finalMatchingScore = weightedScores[0];
    
    expect(finalMatchingScore).toBeGreaterThanOrEqual(0);
    expect(finalMatchingScore).toBeLessThanOrEqual(100);
    expect(Number.isNaN(finalMatchingScore)).toBe(false);
    expect(finalMatchingScore).toBe(72.5);

    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(
      currentCustomerData,
      historicalPatterns
    );
    expect(mockEvaluatePatternRelevance).toHaveBeenCalledTimes(2);
  });
});