import { describe, test, expect } from "@jest/globals";
import { analyzeVisitCountWithValidation } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-1143
  test("訪問件数が負の値のとき、INVALID_VISIT_COUNTエラーを返す", () => {
    const invalid_visit_count = -5;
    const sales_rep_id = "SR001";
    const analysis_period_start = new Date("2024-01-01T00:00:00Z");
    const analysis_period_end = new Date("2024-01-31T23:59:59Z");

    expect(() =>
      analyzeVisitCountWithValidation({
        sales_rep_id,
        visit_count: invalid_visit_count,
        analysis_period_start,
        analysis_period_end,
      })
    ).toThrow(/訪問件数/);
  });
});