import { evaluateRecommendationPrecision } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2368: 提案内容の分析結果が0件のとき、デフォルト値が適用される", () => {
    // Arrange: AIエージェント推奨ロジックが空配列を返すシナリオを準備
    const emptyAnalysisResult: {
      dealId: string;
      patterns: Array<{
        patternId: string;
        relevanceScore: number;
        matchedFeatures: string[];
      }>;
    } = {
      dealId: "DEAL-2024-001",
      patterns: [],
    };

    // Act: 分析結果が0件の条件下でスコア計算処理を実行
    const result = evaluateRecommendationPrecision(emptyAnalysisResult);

    // Assert: スコアがデフォルト値で返却されることを確認
    // システム定義のデフォルト精度スコア（推奨パターンマスタ統計値）: 45.0
    expect(result).toEqual({
      precisionScore: 45.0,
      scoreType: "number",
      sourceType: "default_pattern_master",
      appliedAt: expect.any(String),
    });

    expect(typeof result.precisionScore).toBe("number");
    expect(result.precisionScore).toBe(45.0);
    expect(result.sourceType).toBe("default_pattern_master");
  });
});