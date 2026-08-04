import { evaluateRecommendationWithFallback } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2194
  test("管理職への数値化結果の提示 - 両スコア計算失敗時は計算結果なしが通知される", () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockRejectedValue(
        new Error("Pattern relevance calculation failed")
      ),
      findSimilarPatterns: jest.fn().mockRejectedValue(
        new Error("Similar patterns search failed")
      ),
    };

    const newProjectData = {
      customerId: "CUST-20240115-001",
      customerIndustry: "manufacturing",
      customerScale: "large",
      dealAmount: 5000000,
      dealTimeline: 90,
      dealDescription: "ERP system implementation",
    };

    const result = evaluateRecommendationWithFallback(
      newProjectData,
      mockAIRecommendationEngine
    );

    expect(result.divergenceScore).toBeNull();
    expect(result.matchScore).toBeNull();
    expect(result.notificationMessage).toMatch(/計算結果なし/);
    expect(result.notificationMessage).toMatch(/数値化スコアの計算に失敗しました/);
    expect(result.notificationMessage).toMatch(/推奨パターンマスタ/);
    expect(result.reportScoreStatus).toBe("計算対象外");
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "CUST-20240115-001",
      })
    );
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        dealAmount: 5000000,
      })
    );
  });
});