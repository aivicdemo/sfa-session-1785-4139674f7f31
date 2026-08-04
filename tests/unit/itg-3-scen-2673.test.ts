import { describe, it, expect, beforeEach } from "@jest/globals";
import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  it("SCEN-2673: 適用成功パターンが0件のとき、根拠表示として「適用可能なパターンなし」が出力される", () => {
    // Arrange: 新規案件の条件を定義
    const newDealCondition = {
      customerId: "cust_20240115_001",
      customerIndustry: "製造業",
      customerScale: "中堅企業",
      dealStage: "初期接触",
      dealAmount: 5000000,
      dealTimeline: "3ヶ月",
    };

    // AIRecommendationEngine のモック化
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        applicablePatternCount: 0,
        relevanceScore: 0,
        isApplicable: false,
      }),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "適用可能なパターンなし"
      ),
      generateRecommendation: jest.fn(),
    };

    // Act: 推奨根拠の可視化出力機能を実行
    const reasoningOutput = visualizeRecommendationReasoning(
      newDealCondition,
      mockAIRecommendationEngine
    );

    // Assert: 出力結果に「適用可能なパターンなし」が含まれていることを確認
    expect(reasoningOutput).toContain("適用可能なパターンなし");
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
    expect(
      mockAIRecommendationEngine.evaluatePatternRelevance
    ).toHaveBeenCalled();
    expect(reasoningOutput).toBe("適用可能なパターンなし");
  });
});