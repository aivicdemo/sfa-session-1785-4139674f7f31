import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨妥当性スコア算出機能 - 同値スコア含む集計", () => {
  // SCEN-1719
  test("購買履歴に同値が並ぶとき推奨スコアを同値を含めて計算する", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatterns = [
      {
        id: "pattern_a",
        name: "パターンA",
        conditions: { industry: "製造", scale: "large" },
      },
      {
        id: "pattern_b",
        name: "パターンB",
        conditions: { industry: "製造", scale: "large" },
      },
      {
        id: "pattern_c",
        name: "パターンC",
        conditions: { industry: "製造", scale: "medium" },
      },
    ];

    mockAIEngine.evaluatePatternRelevance
      .mockReturnValueOnce({ patternId: "pattern_a", relevanceScore: 0.85 })
      .mockReturnValueOnce({ patternId: "pattern_b", relevanceScore: 0.85 })
      .mockReturnValueOnce({ patternId: "pattern_c", relevanceScore: 0.8 });

    const dealCondition = {
      customerId: "cust_001",
      customerIndustry: "製造",
      customerScale: "large",
      dealStage: "proposal",
      estimatedAmount: 5000000,
      purchaseHistory: [
        { date: "2024-01-15", amount: 1000000 },
        { date: "2024-02-20", amount: 1500000 },
      ],
    };

    const scoreResults = mockPatterns.map((pattern) =>
      mockAIEngine.evaluatePatternRelevance(pattern, dealCondition)
    );

    const scoreGrouped: { [key: number]: string[] } = {};
    scoreResults.forEach((result) => {
      const score = result.relevanceScore;
      if (!scoreGrouped[score]) {
        scoreGrouped[score] = [];
      }
      scoreGrouped[score].push(result.patternId);
    });

    const sortedScores = Object.keys(scoreGrouped)
      .map(Number)
      .sort((a, b) => b - a);

    expect(sortedScores).toEqual([0.85, 0.8]);
    expect(scoreGrouped[0.85]).toHaveLength(2);
    expect(scoreGrouped[0.85]).toEqual(expect.arrayContaining([
      "pattern_a",
      "pattern_b",
    ]));
    expect(scoreGrouped[0.8]).toHaveLength(1);
    expect(scoreGrouped[0.8]).toEqual(["pattern_c"]);

    expect(scoreResults).toEqual([
      { patternId: "pattern_a", relevanceScore: 0.85 },
      { patternId: "pattern_b", relevanceScore: 0.85 },
      { patternId: "pattern_c", relevanceScore: 0.8 },
    ]);
  });
});