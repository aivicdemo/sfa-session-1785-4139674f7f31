import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  test("SCEN-367: [error] 推奨精度検証機能 - 成功パターンマッチスコアが負数のとき、パターン関連性評価がエラーになる", () => {
    // Arrange: テスト用の商談条件オブジェクトを準備
    const dealCondition = {
      customerName: "テスト顧客A",
      dealAmount: 5000000,
      industry: "製造業",
      companySize: "large",
      salesStage: "提案中",
    };

    // 負数のパターンマッチスコアを含む成功パターン
    const successPatternWithNegativeScore = {
      patternId: "pattern-001",
      patternName: "成功パターンA",
      matchScore: -0.5, // 負数（無効なスコア）
      relevanceFactors: ["顧客業種一致", "予算レンジ合致"],
      recommendedApproach: "パーソナライズ提案",
    };

    // Act & Assert: パターン関連性評価機能がエラーを発生させることを検証
    expect(() =>
      evaluatePatternRelevance(dealCondition, successPatternWithNegativeScore)
    ).toThrow(/パターンマッチスコア/);
  });
});