import { calculateImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度ランク算出", () => {
  test("SCEN-486: 改善対象項目の重要度スコアがnullのときエラーをスロー", () => {
    // Arrange
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(75),
    };

    const improvementItemsWithNullScore = [
      {
        id: "item-001",
        name: "提案資料の初期化精度改善",
        importanceScore: 85,
      },
      {
        id: "item-002",
        name: "顧客ニーズ適合度分析",
        importanceScore: null, // null値を含む
      },
      {
        id: "item-003",
        name: "推奨タイミング検出",
        importanceScore: 60,
      },
    ];

    // Act & Assert
    expect(() =>
      calculateImprovementPriorityRank(
        improvementItemsWithNullScore,
        mockAIEngine
      )
    ).toThrow(/importanceScore|重要度スコア/);
  });
});