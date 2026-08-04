import { findSimilarPatterns, evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・推奨機能", () => {
  // SCEN-675
  test("顧客条件が複数件のとき、すべての条件に照合した成功パターンを返す", () => {
    // 複合条件オブジェクトの構成：業界、企業規模、予算、決定者数
    const combinedCondition = {
      industry: "製造",
      companySize: "中堅",
      budget: 10000000,
      decisionMakers: 3,
    };

    // AIRecommendationEngineのスタブ定義
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "pattern_001",
          industry: "製造",
          companySize: "中堅",
          budget: 10000000,
          decisionMakers: 3,
          successRate: 0.92,
          caseCount: 15,
        },
        {
          patternId: "pattern_002",
          industry: "製造",
          companySize: "中堅",
          budget: 10000000,
          decisionMakers: 3,
          successRate: 0.88,
          caseCount: 12,
        },
        {
          patternId: "pattern_003",
          industry: "製造",
          companySize: "大企業",
          budget: 15000000,
          decisionMakers: 5,
          successRate: 0.85,
          caseCount: 20,
        },
      ]),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation((pattern, condition) => {
          const matchScore =
            pattern.industry === condition.industry ? 0.25 : 0 +
            (pattern.companySize === condition.companySize ? 0.25 : 0) +
            (pattern.budget === condition.budget ? 0.25 : 0) +
            (pattern.decisionMakers === condition.decisionMakers ? 0.25 : 0);
          return matchScore;
        }),
    };

    // findSimilarPatternsを実行
    const extractedPatterns = findSimilarPatterns(
      mockAIEngine,
      combinedCondition
    );

    // 各パターンに対して適合スコアを算出
    const patternsWithScores = extractedPatterns.map((pattern) => ({
      ...pattern,
      relevanceScore: evaluatePatternRelevance(mockAIEngine, pattern, combinedCondition),
    }));

    // スコア順でソート
    const sortedPatterns = patternsWithScores.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    // 検証1: 複合条件のすべてを満たすパターンが返却される
    const fullyMatchingPatterns = sortedPatterns.filter(
      (p) => p.relevanceScore === 1.0
    );
    expect(fullyMatchingPatterns.length).toBe(2);
    expect(fullyMatchingPatterns[0].patternId).toBe("pattern_001");
    expect(fullyMatchingPatterns[1].patternId).toBe("pattern_002");

    // 検証2: 条件の一部のみに合致するパターンは適合スコアが低い
    const partiallyMatchingPatterns = sortedPatterns.filter(
      (p) => p.relevanceScore < 1.0
    );
    expect(partiallyMatchingPatterns.length).toBe(1);
    expect(partiallyMatchingPatterns[0].patternId).toBe("pattern_003");
    expect(partiallyMatchingPatterns[0].relevanceScore).toBe(0.5);

    // 検証3: 各パターンに0.0～1.0の適合スコアが付与されている
    sortedPatterns.forEach((pattern) => {
      expect(pattern.relevanceScore).toBeGreaterThanOrEqual(0.0);
      expect(pattern.relevanceScore).toBeLessThanOrEqual(1.0);
    });

    // 検証4: パターンが適合スコア順でソートされている
    for (let i = 0; i < sortedPatterns.length - 1; i++) {
      expect(sortedPatterns[i].relevanceScore).toBeGreaterThanOrEqual(
        sortedPatterns[i + 1].relevanceScore
      );
    }

    // 検証5: mockが正しく呼び出されている
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      combinedCondition
    );
  });
});