import { generateRecommendationWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-189: [edge] 推奨内容キャッシュ管理機能 - AIエージェント呼び出し失敗時に過去推奨履歴が0件である場合の代替動作
  test("should execute fallback to recommendation pattern master when AI engine fails and cache is empty", async () => {
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error("API timeout")),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const stubRecommendationCache = {
      getLatestRecommendations: jest.fn().mockResolvedValue([]),
    };

    const stubRecommendationPatternMaster = {
      getTopSuccessPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "PATTERN-MFG-001",
          successRate: 78,
          industryCategory: "製造業",
          budgetRange: "500万-1000万",
          proposalApproach: "コスト最適化提案",
          briefExplanation: "製造業向け標準パターン：コスト削減実績が高い",
          templateDescription: "3か月ROI達成型の提案テンプレート",
        },
      ]),
    };

    const newCaseData = {
      customerId: "TEST-CUST-001",
      budget: 5000000,
      industry: "製造業",
      dealConditions: "初期導入案件",
    };

    const result = await generateRecommendationWithFallback(
      newCaseData,
      stubAIEngine,
      stubRecommendationCache,
      stubRecommendationPatternMaster
    );

    expect(stubAIEngine.generateRecommendation).toHaveBeenCalledTimes(3);
    expect(stubRecommendationCache.getLatestRecommendations).not.toHaveBeenCalled();
    expect(stubRecommendationPatternMaster.getTopSuccessPatterns).toHaveBeenCalledWith(
      { industry: "製造業", budget: 5000000 },
      { limit: 1, orderBy: "successRate" }
    );

    expect(result).toEqual({
      patternId: "PATTERN-MFG-001",
      successRate: 78,
      proposalApproach: "コスト最適化提案",
      briefExplanation: "製造業向け標準パターン：コスト削減実績が高い",
      userMessage:
        "推奨の生成に一時的な遅延が発生しています。過去の推奨履歴から類似案件を表示します",
      source: "recommendation_pattern_master",
      isSimplifiedExplanation: true,
    });
  });
});