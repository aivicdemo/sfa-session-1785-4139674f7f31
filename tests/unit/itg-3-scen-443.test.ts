import { evaluateTransactionDataQuality } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業トランザクションデータ品質評価", () => {
  // SCEN-443
  test("営業トランザクションのエラー件数が複数件の場合、件数に応じたスコアが算出される", () => {
    const transactionErrors = [
      {
        error_id: "ERR001",
        error_type: "data_type_mismatch",
        severity: "high",
        field_name: "revenue_amount",
      },
      {
        error_id: "ERR002",
        error_type: "required_field_missing",
        severity: "medium",
        field_name: "customer_code",
      },
      {
        error_id: "ERR003",
        error_type: "format_invalid",
        severity: "low",
        field_name: "contract_date",
      },
    ];

    const result = evaluateTransactionDataQuality({
      transaction_id: "TXN20240115001",
      errors: transactionErrors,
    });

    expect(result.quality_score).toBe(65);
    expect(result.quality_score).toBeGreaterThanOrEqual(0);
    expect(result.quality_score).toBeLessThanOrEqual(100);
    expect(Number.isInteger(result.quality_score)).toBe(true);
    expect(result.error_count).toBe(3);
    expect(result.severity_breakdown).toEqual({
      high: 1,
      medium: 1,
      low: 1,
    });
  });
});