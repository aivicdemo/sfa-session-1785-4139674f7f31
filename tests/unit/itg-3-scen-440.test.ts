import { evaluateCustomerMasterQuality } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 顧客マスタ品質評価", () => {
  // SCEN-440
  test("顧客マスタのエラー件数が複数件の場合、件数に応じたスコアが算出される", () => {
    const testPatterns = [
      { errorCount: 0, expectedScore: 100 },
      { errorCount: 1, expectedScore: 95 },
      { errorCount: 3, expectedScore: 85 },
      { errorCount: 5, expectedScore: 75 },
      { errorCount: 10, expectedScore: 50 },
    ];

    testPatterns.forEach(({ errorCount, expectedScore }) => {
      const customerMasterRecord = {
        id: `customer_${errorCount}`,
        name: "テスト顧客",
        industry: "製造業",
        scale: "大企業",
        errorCount: errorCount,
      };

      const result = evaluateCustomerMasterQuality(customerMasterRecord);

      expect(result.score).toBe(expectedScore);
      expect(typeof result.score).toBe("number");
      expect(Number.isInteger(result.score)).toBe(true);
    });
  });
});