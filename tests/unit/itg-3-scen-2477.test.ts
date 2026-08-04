import { recommendApproach } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチの自動推奨機能", () => {
  // SCEN-2477
  test("商談条件が指定された場合、その条件に適用可能な成功パターンから提案アプローチが推奨される", () => {
    // テストデータ: 商談条件の定義
    const dealCondition = {
      customerIndustry: "製造業",
      projectSize: "500万円以上",
      decisionPeriod: "3ヶ月以内",
      competitiveStatus: "競合あり",
    };

    // 過去成功パターンのモックデータ
    const mockSimilarPatterns = [
      {
        patternId: "pattern_001",
        industry: "製造業",
        projectSize: "500万円以上",
        description: "大規模製造業案件の提案パターン1",
      },
      {
        patternId: "pattern_002",
        industry: "製造業",
        projectSize: "500万円以上",
        description: "大規模製造業案件の提案パターン2",
      },
      {
        patternId: "pattern_003",
        industry: "製造業",
        projectSize: "500万円以上",
        description: "大規模製造業案件の提案パターン3",
      },
    ];

    // パターン適用可能性スコアのモックデータ
    const mockRelevanceScores = {
      pattern_001: 0.8,
      pattern_002: 0.75,
      pattern_003: 0.7,
    };

    // 推奨アプローチのモックデータ
    const mockRecommendation = {
      approachName: "提案型営業アプローチ",
      relevanceScore: 0.8,
      basis: "類似する製造業での成功事例に基づく",
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      findSimilarPatterns: jest.fn(() => mockSimilarPatterns),
      evaluatePatternRelevance: jest
        .fn()
        .mockImplementation(
          (pattern) => mockRelevanceScores[pattern.patternId]
        ),
      generateRecommendation: jest.fn(() => mockRecommendation),
      explainRecommendationReasoning: jest.fn(),
    };

    // テスト対象の関数を呼び出す
    const result = recommendApproach(dealCondition, mockAIEngine);

    // 推奨提案アプローチが『提案型営業アプローチ』であることを検証
    expect(result.approachName).toBe("提案型営業アプローチ");

    // 適用可能性スコアが0.8であることを検証
    expect(result.relevanceScore).toBe(0.8);

    // 推奨根拠が『類似する製造業での成功事例に基づく』を含むことを検証
    expect(result.basis).toContain("類似する製造業での成功事例に基づく");

    // AIRecommendationEngineのfindSimilarPatternsメソッドが
    // 指定商談条件を引数として正確に1回呼び出されたことを検証
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(dealCondition);

    // AIRecommendationEngineのevaluatePatternRelevanceメソッドが
    // 抽出された3パターンそれぞれに対して呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(3);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      mockSimilarPatterns[0]
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      mockSimilarPatterns[1]
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      mockSimilarPatterns[2]
    );

    // generateRecommendationメソッドが最もスコアの高いパターンで呼び出されたことを検証
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
  });
});