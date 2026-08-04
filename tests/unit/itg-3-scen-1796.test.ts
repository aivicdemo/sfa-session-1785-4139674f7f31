import { generateRecommendationApproaches } from "../../src/logic/it-1-br-3-3-2-1";

describe("提案アプローチ推奨機能 - 成功パターンが見つからないケース", () => {
  test("SCEN-1796: 適用可能な成功パターンが存在しない場合、空の提案アプローチリストが返却される", async () => {
    // Arrange: AIRecommendationEngineのモック
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        matchingPatterns: [],
        hasApplicablePatterns: false,
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 新規案件の顧客情報
    const newDealInput = {
      customerIndustry: "小売",
      customerChallenge: "在庫管理",
      budget: 5000000,
      companySize: "中規模",
      region: "関東",
    };

    // Act: 提案アプローチ推奨機能を実行
    const result = await generateRecommendationApproaches(
      newDealInput,
      mockAIEngine
    );

    // Assert: 返却されたレスポンスボディを検証
    expect(result).toEqual({
      recommendedApproaches: [],
      totalCount: 0,
      cacheUsed: false,
      status: "no_applicable_patterns_found",
      userMessage:
        "適用可能な過去成功パターンが見つかりませんでした。営業担当者に相談してください。",
    });

    // 提案アプローチリストが空配列であることを確認
    expect(result.recommendedApproaches).toEqual([]);
    expect(Array.isArray(result.recommendedApproaches)).toBe(true);
    expect(result.totalCount).toBe(0);
    expect(result.cacheUsed).toBe(false);
    expect(result.status).toBe("no_applicable_patterns_found");

    // AIエンジンのメソッドが呼ばれたことを確認
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealInput
    );
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealInput,
      []
    );
  });
});