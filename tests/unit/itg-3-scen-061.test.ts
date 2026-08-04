import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("SCEN-061: パターン適用可能性評価機能", () => {
  test("SCEN-061 新規案件に対する成功パターンの適用可能性を0から1の範囲でスコア化して返す", () => {
    // 新規案件データ（顧客業種: IT、商談規模: 500万円、決定者数: 3名）
    const newDeal = {
      industry: "IT",
      dealSize: 5000000,
      decisionMakers: 3,
    };

    // 過去の成功パターン（顧客業種: IT、商談規模: 400～600万円、決定者数: 2～4名）
    const successPattern = {
      industry: "IT",
      dealSizeMin: 4000000,
      dealSizeMax: 6000000,
      decisionMakersMin: 2,
      decisionMakersMax: 4,
    };

    // evaluatePatternRelevance メソッドを呼び出し、適用可能性スコアを取得
    const relevanceScore = evaluatePatternRelevance(newDeal, successPattern);

    // 返却されたスコア値の型を検証
    expect(typeof relevanceScore).toBe("number");

    // スコア値が0から1の範囲内に収まっているか確認
    expect(relevanceScore).toBeGreaterThanOrEqual(0);
    expect(relevanceScore).toBeLessThanOrEqual(1);

    // 業種が完全一致し、規模と決定者数が範囲内にあるため、スコアは高い値（例：0.87）を期待
    expect(relevanceScore).toBeGreaterThan(0.75);
  });

  test("SCEN-061 複数の異なる類似度を持つパターンで各々のスコアが異なることを確認", () => {
    const newDeal = {
      industry: "IT",
      dealSize: 5000000,
      decisionMakers: 3,
    };

    // ケース1：完全に適合するパターン
    const highMatchPattern = {
      industry: "IT",
      dealSizeMin: 4000000,
      dealSizeMax: 6000000,
      decisionMakersMin: 2,
      decisionMakersMax: 4,
    };

    // ケース2：業種は異なるが規模は合致するパターン
    const partialMatchPattern = {
      industry: "Finance",
      dealSizeMin: 4000000,
      dealSizeMax: 6000000,
      decisionMakersMin: 2,
      decisionMakersMax: 4,
    };

    // ケース3：業種・規模・決定者数すべてが乖離するパターン
    const lowMatchPattern = {
      industry: "Retail",
      dealSizeMin: 1000000,
      dealSizeMax: 2000000,
      decisionMakersMin: 1,
      decisionMakersMax: 2,
    };

    const highScore = evaluatePatternRelevance(newDeal, highMatchPattern);
    const partialScore = evaluatePatternRelevance(
      newDeal,
      partialMatchPattern
    );
    const lowScore = evaluatePatternRelevance(newDeal, lowMatchPattern);

    // すべてのスコアが0から1の範囲内
    expect(highScore).toBeGreaterThanOrEqual(0);
    expect(highScore).toBeLessThanOrEqual(1);
    expect(partialScore).toBeGreaterThanOrEqual(0);
    expect(partialScore).toBeLessThanOrEqual(1);
    expect(lowScore).toBeGreaterThanOrEqual(0);
    expect(lowScore).toBeLessThanOrEqual(1);

    // 各スコアが適合度に応じて異なる値で返却される
    expect(highScore).toBeGreaterThan(partialScore);
    expect(partialScore).toBeGreaterThan(lowScore);
  });
});