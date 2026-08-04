import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と新規案件への推奨機能", () => {
  // SCEN-1345
  test("類似パターンが複数抽出されるとき、適用可能性スコアの高い順でランク付けされる", () => {
    const newDealCondition = {
      customerIndustry: "manufacturing",
      customerScale: "large",
      dealAmount: 5000000,
      dealStage: "proposal",
      productCategory: "cloud_erp",
    };

    const mockPatternA = {
      patternId: "pattern_001",
      customerIndustry: "manufacturing",
      customerScale: "large",
      dealAmount: 4800000,
      productCategory: "cloud_erp",
      relevanceScore: 0.92,
      successRate: 0.88,
      proposalApproach: "value_driven",
      keySuccessFactors: ["executive_alignment", "process_redesign"],
    };

    const mockPatternB = {
      patternId: "pattern_002",
      customerIndustry: "manufacturing",
      customerScale: "large",
      dealAmount: 5200000,
      productCategory: "cloud_erp",
      relevanceScore: 0.78,
      successRate: 0.72,
      proposalApproach: "cost_optimization",
      keySuccessFactors: ["roi_focus"],
    };

    const mockPatternC = {
      patternId: "pattern_003",
      customerIndustry: "manufacturing",
      customerScale: "large",
      dealAmount: 4900000,
      productCategory: "cloud_erp",
      relevanceScore: 0.85,
      successRate: 0.81,
      proposalApproach: "operational_excellence",
      keySuccessFactors: ["efficiency_gain", "automation"],
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        mockPatternA,
        mockPatternB,
        mockPatternC,
      ]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    return findSimilarPatterns(newDealCondition, mockAIEngine).then(
      (result) => {
        expect(result).toHaveLength(3);
        expect(result[0].patternId).toBe("pattern_001");
        expect(result[0].relevanceScore).toBe(0.92);
        expect(result[1].patternId).toBe("pattern_003");
        expect(result[1].relevanceScore).toBe(0.85);
        expect(result[2].patternId).toBe("pattern_002");
        expect(result[2].relevanceScore).toBe(0.78);
        expect(result[0].relevanceScore).toBeGreaterThan(
          result[1].relevanceScore
        );
        expect(result[1].relevanceScore).toBeGreaterThan(
          result[2].relevanceScore
        );
      }
    );
  });
});