import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ自動推奨", () => {
  // SCEN-1543
  test("過去商談データから複数の成功パターンが抽出される場合、全パターンが新規案件条件との照合対象となる", () => {
    const mockSuccessPattern1 = {
      patternId: "pattern_001",
      industry: "製造業",
      employeeCount: 500,
      challenge: "デジタル化推進",
      approachType: "クラウド導入支援",
      successRate: 0.85,
    };

    const mockSuccessPattern2 = {
      patternId: "pattern_002",
      industry: "製造業",
      employeeCount: 450,
      challenge: "デジタル化推進",
      approachType: "RPA導入支援",
      successRate: 0.82,
    };

    const mockSuccessPattern3 = {
      patternId: "pattern_003",
      industry: "製造業",
      employeeCount: 550,
      challenge: "デジタル化推進",
      approachType: "AI活用コンサル",
      successRate: 0.88,
    };

    const similarPatterns = [
      mockSuccessPattern1,
      mockSuccessPattern2,
      mockSuccessPattern3,
    ];

    let findSimilarPatternsCallCount = 0;
    let evaluatePatternRelevanceCallCount = 0;
    const evaluatedPatternIds: string[] = [];

    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => {
        findSimilarPatternsCallCount++;
        return similarPatterns;
      }),
      evaluatePatternRelevance: jest.fn((pattern: typeof mockSuccessPattern1) => {
        evaluatePatternRelevanceCallCount++;
        evaluatedPatternIds.push(pattern.patternId);
        if (pattern.patternId === "pattern_001") return 0.92;
        if (pattern.patternId === "pattern_002") return 0.78;
        if (pattern.patternId === "pattern_003") return 0.95;
        return 0.0;
      }),
      explainRecommendationReasoning: jest.fn(() => {
        return "複数の成功パターンから分析した結果、3件のパターンを検討した上で、最もAI活用コンサルのアプローチが推奨されます";
      }),
    };

    const newCaseCondition = {
      industry: "製造業",
      employeeCount: 500,
      challenge: "デジタル化推進",
    };

    const result = generateRecommendation(newCaseCondition, mockAIEngine);

    expect(findSimilarPatternsCallCount).toBe(1);
    expect(evaluatePatternRelevanceCallCount).toBe(3);
    expect(evaluatedPatternIds).toEqual([
      "pattern_001",
      "pattern_002",
      "pattern_003",
    ]);
    expect(result.recommendedApproach).toBeDefined();
    expect(result.relevanceScores).toHaveLength(3);
    expect(result.relevanceScores[0]).toBe(0.92);
    expect(result.relevanceScores[1]).toBe(0.78);
    expect(result.relevanceScores[2]).toBe(0.95);
    expect(result.reasoning).toContain("3件");
    expect(result.reasoning).toContain("複数の成功パターン");
    expect(result.highestRelevanceScore).toBe(0.95);
  });
});