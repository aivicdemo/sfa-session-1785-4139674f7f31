import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン照合機能 - 新規案件条件が過去成功パターン0件と照合される", () => {
  test("SCEN-894: 過去成功パターンが0件の場合、代替パターンを返す", async () => {
    const newDealCondition = {
      customerIndustry: "IT企業",
      dealAmount: 5000000,
      decisionMakerCount: 3,
      leadTimeMonths: 2,
    };

    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        id: "pattern_001",
        industry: "IT企業",
        dealSize: "500万-1000万",
        successRate: 0.85,
        ranking: 1,
      },
      {
        id: "pattern_002",
        industry: "IT企業",
        dealSize: "500万以下",
        successRate: 0.78,
        ranking: 2,
      },
      {
        id: "pattern_003",
        industry: "金融",
        dealSize: "1000万以上",
        successRate: 0.72,
        ranking: 3,
      },
    ];

    const result = await findSimilarPatterns(
      newDealCondition,
      mockAIEngine,
      mockPatternMaster
    );

    expect(Array.isArray(result.similarPatterns)).toBe(true);
    expect(result.similarPatterns.length).toBe(0);
    expect(result.message).toMatch(/類似成功事例が見つかりませんでした/);
    expect(result.fallbackPatterns).toEqual([
      mockPatternMaster[0],
      mockPatternMaster[1],
      mockPatternMaster[2],
    ]);
    expect(result.fallbackPatterns.length).toBe(3);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});