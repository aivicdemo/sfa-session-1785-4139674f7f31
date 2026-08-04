import { evaluateRecommendationRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1642: [normal] 推奨妥当性スコア算出機能 - 購買履歴が昇順降順混在している場合、スコアが正しく算出される
  test("購買履歴の時系列順序に関わらず推奨妥当性スコアが同一である", () => {
    const customerId = "CUST-20240115-001";
    const dealConditions = {
      productCategory: "Enterprise Software",
      estimatedAmount: 500000,
      contractDuration: 24,
      targetIndustry: "Manufacturing",
    };

    // Pattern 1: 昇順（正順）
    const purchaseHistoryAscending = [
      {
        purchaseDate: "2024-01-15",
        amount: 100000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-02-20",
        amount: 150000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-03-10",
        amount: 120000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-04-05",
        amount: 200000,
        productCategory: "Enterprise Software",
      },
    ];

    // Pattern 2: 降順（逆順）
    const purchaseHistoryDescending = [
      {
        purchaseDate: "2024-04-05",
        amount: 200000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-03-10",
        amount: 120000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-02-20",
        amount: 150000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-01-15",
        amount: 100000,
        productCategory: "Enterprise Software",
      },
    ];

    // Pattern 3: 混在（昇順・降順・昇順）
    const purchaseHistoryMixed = [
      {
        purchaseDate: "2024-01-15",
        amount: 100000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-03-10",
        amount: 120000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-02-20",
        amount: 150000,
        productCategory: "Enterprise Software",
      },
      {
        purchaseDate: "2024-04-05",
        amount: 200000,
        productCategory: "Enterprise Software",
      },
    ];

    // 各パターンでスコアを算出
    const scoreAscending = evaluateRecommendationRelevance(
      customerId,
      dealConditions,
      purchaseHistoryAscending
    );
    const scoreDescending = evaluateRecommendationRelevance(
      customerId,
      dealConditions,
      purchaseHistoryDescending
    );
    const scoreMixed = evaluateRecommendationRelevance(
      customerId,
      dealConditions,
      purchaseHistoryMixed
    );

    // スコア値が0以上1以下の範囲内にあることを確認
    expect(scoreAscending).toBeGreaterThanOrEqual(0);
    expect(scoreAscending).toBeLessThanOrEqual(1);
    expect(scoreDescending).toBeGreaterThanOrEqual(0);
    expect(scoreDescending).toBeLessThanOrEqual(1);
    expect(scoreMixed).toBeGreaterThanOrEqual(0);
    expect(scoreMixed).toBeLessThanOrEqual(1);

    // 3パターンのスコア値が同一であることをアサート（±0.01の浮動小数点許容誤差内）
    expect(Math.abs(scoreAscending - scoreDescending)).toBeLessThan(0.01);
    expect(Math.abs(scoreAscending - scoreMixed)).toBeLessThan(0.01);
    expect(Math.abs(scoreDescending - scoreMixed)).toBeLessThan(0.01);

    // 期待値（例：0.78）であることを確認
    expect(scoreAscending).toBeCloseTo(0.78, 2);
  });
});