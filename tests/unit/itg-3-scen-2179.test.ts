import { evaluateCustomerPatternMatch } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2179: 顧客対応パターンと成功パターンのマッチスコア算出 - マッチスコアが0で算出される", () => {
    // Stub化したAIRecommendationEngineのevaluatePatternRelevanceメソッド
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0),
    };

    // 現在の顧客対応パターン
    const currentPattern = {
      industry: "小売",
      dealStage: "初期接触",
      budgetSize: "500万円以下",
      decisionMaker: "現場責任者",
    };

    // 成功パターンマスタの参照パターン
    const successPattern = {
      industry: "製造業",
      dealStage: "導入決定",
      budgetSize: "5000万円以上",
      decisionMaker: "経営層",
    };

    // テスト対象の顧客対応パターンマッチスコア算出ロジックを呼び出す
    const matchScore = evaluateCustomerPatternMatch(
      currentPattern,
      successPattern,
      mockAIEngine
    );

    // スタブのevaluatePatternRelevanceメソッドが1回だけ呼び出されたことを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(1);

    // 引数として現在のパターンと成功パターンの組み合わせが渡されていることを検証
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      currentPattern,
      successPattern
    );

    // マッチスコアが整数値0で算出されることを検証
    expect(matchScore).toBe(0);
  });
});