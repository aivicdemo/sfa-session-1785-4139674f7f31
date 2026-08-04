import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨機能 - 単一の適用可能な成功パターンが推奨される", () => {
  // SCEN-1794
  test("新規案件データから単一の適用可能な成功パターンが提案アプローチとして推奨される", () => {
    // テスト用の新規案件データ
    const newDealData = {
      customerIndustry: "manufacturing",
      challenge: "production_efficiency",
      budgetRange: "medium",
    };

    // AIRecommendationEngine スタブの定義
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([
      {
        patternId: "PATTERN-001",
        proposalApproach: "プロセス自動化ソリューション提案",
        relevanceScore: 0.92,
        successCaseInfo: {
          caseId: "CASE-2024-001",
          industry: "manufacturing",
          result: "成功",
        },
      },
    ]);

    const mockGenerateRecommendation = jest.fn().mockReturnValue({
      recommendedApproach: "プロセス自動化ソリューション提案",
      relevanceScore: 0.92,
      reasoning:
        "製造業における生産効率化課題は、プロセス自動化ソリューションで解決した成功事例が過去に存在します。同様の顧客属性と課題パターンに基づいて推奨します。",
      sourcePatternId: "PATTERN-001",
    });

    const mockEvaluatePatternRelevance = jest.fn().mockReturnValue({
      isApplicable: true,
      relevanceScore: 0.92,
      applicabilityThreshold: 0.85,
    });

    const aiRecommendationEngineStub = {
      findSimilarPatterns: mockFindSimilarPatterns,
      generateRecommendation: mockGenerateRecommendation,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
    };

    // 推奨機能の実行
    const result = generateRecommendation(newDealData, aiRecommendationEngineStub);

    // 期待結果の検証
    expect(result.recommendedApproach).toBe(
      "プロセス自動化ソリューション提案"
    );
    expect(result.applicabilityScore).toBe(0.92);
    expect(result.reasoning).toMatch(/製造業/);
    expect(result.reasoning).toMatch(/生産効率化/);
    expect(result.sourcePatternId).toBe("PATTERN-001");
    expect(result.recommendationCount).toBe(1);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0]).toEqual({
      patternId: "PATTERN-001",
      approach: "プロセス自動化ソリューション提案",
      score: 0.92,
      isSingleRecommendation: true,
    });

    // スタブが期待通りに呼ばれたことを確認
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(newDealData);
    expect(mockGenerateRecommendation).toHaveBeenCalled();
    expect(mockEvaluatePatternRelevance).toHaveBeenCalled();
  });
});