import { calculateImprovementPriorityRank } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 改善優先度ランク算出", () => {
  test("SCEN-486: 改善対象項目の重要度スコアがnullのときエラーが発生する", () => {
    const improvementItems = [
      {
        id: "item-001",
        name: "顧客データ入力形式の統一",
        importanceScore: 85,
      },
      {
        id: "item-002",
        name: "提案資料テンプレートの標準化",
        importanceScore: null,
      },
      {
        id: "item-003",
        name: "営業プロセスドキュメント整備",
        importanceScore: 72,
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.92),
    };

    expect(() =>
      calculateImprovementPriorityRank(improvementItems, mockAIEngine)
    ).toThrow(/重要度スコア|importanceScore|INVALID_IMPORTANCE_SCORE/);
  });
});