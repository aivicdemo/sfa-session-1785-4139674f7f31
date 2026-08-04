import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン自動抽出・提案アプローチ推奨機能", () => {
  // SCEN-609
  test("抽出された成功パターンの適用可能性が高順でスコア化・ランク付けされる", () => {
    const mockSuccessPatterns = [
      {
        id: "pattern_001",
        customerIndustry: "IT",
        budgetRange: "5000000",
        decisionMakers: 3,
        approachStrategy: "technical_deep_dive",
      },
      {
        id: "pattern_002",
        customerIndustry: "IT",
        budgetRange: "5000000",
        decisionMakers: 3,
        approachStrategy: "roi_focused",
      },
      {
        id: "pattern_003",
        customerIndustry: "IT",
        budgetRange: "5000000",
        decisionMakers: 3,
        approachStrategy: "compliance_first",
      },
      {
        id: "pattern_004",
        customerIndustry: "IT",
        budgetRange: "5000000",
        decisionMakers: 3,
        approachStrategy: "poc_based",
      },
      {
        id: "pattern_005",
        customerIndustry: "IT",
        budgetRange: "5000000",
        decisionMakers: 3,
        approachStrategy: "vendor_comparison",
      },
    ];

    const patternRelevanceScores: { [key: string]: number } = {
      pattern_001: 0.95,
      pattern_002: 0.78,
      pattern_003: 0.65,
      pattern_004: 0.42,
      pattern_005: 0.28,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: (pattern: { id: string }): number => {
        return patternRelevanceScores[pattern.id] ?? 0;
      },
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const dealCondition = {
      customerIndustry: "IT",
      budgetRange: "5000000",
      decisionMakers: 3,
    };

    const result = findSimilarPatterns(dealCondition, mockAIEngine, mockSuccessPatterns);

    expect(result).toHaveLength(5);

    expect(result[0]).toEqual({
      id: "pattern_001",
      customerIndustry: "IT",
      budgetRange: "5000000",
      decisionMakers: 3,
      approachStrategy: "technical_deep_dive",
      relevanceScore: 0.95,
    });

    expect(result[1]).toEqual({
      id: "pattern_002",
      customerIndustry: "IT",
      budgetRange: "5000000",
      decisionMakers: 3,
      approachStrategy: "roi_focused",
      relevanceScore: 0.78,
    });

    expect(result[2]).toEqual({
      id: "pattern_003",
      customerIndustry: "IT",
      budgetRange: "5000000",
      decisionMakers: 3,
      approachStrategy: "compliance_first",
      relevanceScore: 0.65,
    });

    expect(result[3]).toEqual({
      id: "pattern_004",
      customerIndustry: "IT",
      budgetRange: "5000000",
      decisionMakers: 3,
      approachStrategy: "poc_based",
      relevanceScore: 0.42,
    });

    expect(result[4]).toEqual({
      id: "pattern_005",
      customerIndustry: "IT",
      budgetRange: "5000000",
      decisionMakers: 3,
      approachStrategy: "vendor_comparison",
      relevanceScore: 0.28,
    });

    expect(result[0].relevanceScore).toBeGreaterThan(result[1].relevanceScore);
    expect(result[1].relevanceScore).toBeGreaterThan(result[2].relevanceScore);
    expect(result[2].relevanceScore).toBeGreaterThan(result[3].relevanceScore);
    expect(result[3].relevanceScore).toBeGreaterThan(result[4].relevanceScore);
  });
});