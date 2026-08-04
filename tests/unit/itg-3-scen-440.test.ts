import { evaluateCustomerMasterQuality } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 顧客マスタ品質評価", () => {
  // SCEN-440
  test("エラー件数が複数件の場合、件数に応じたスコアが算出される", () => {
    const testCases = [
      { errorCount: 0, expectedScore: 100 },
      { errorCount: 1, expectedScore: 95 },
      { errorCount: 3, expectedScore: 85 },
      { errorCount: 5, expectedScore: 75 },
      { errorCount: 10, expectedScore: 50 },
    ];

    testCases.forEach(({ errorCount, expectedScore }) => {
      const customer_master_record = {
        customer_id: `cust_${errorCount}`,
        error_count: errorCount,
        customer_name: "Test Customer",
        industry: "Technology",
        employee_count: 100,
      };

      const result = evaluateCustomerMasterQuality(
        customer_master_record
      );

      expect(result.quality_score).toBe(expectedScore);
      expect(typeof result.quality_score).toBe("number");
      expect(Number.isInteger(result.quality_score)).toBe(true);
    });
  });
});