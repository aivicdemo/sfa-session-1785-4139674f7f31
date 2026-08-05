import { describe, test, expect } from "@jest/globals";
import { generateSalesPerformanceAnalysisReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  // SCEN-497
  test("成約実績が閾値ちょうど100%に達した場合に行動パターンが優秀と判定される", () => {
    const sales_rep_id = "SR-001";
    const contract_count = 100;
    const target_count = 100;
    const contract_rate = 100.0;
    const rate_threshold = 100.0;

    const result = generateSalesPerformanceAnalysisReport({
      sales_rep_id,
      contract_count,
      target_count,
      contract_rate,
      rate_threshold,
    });

    expect(result).toEqual({
      sales_rep_id: "SR-001",
      performance_judgment: "優秀",
      performance_rate: 100.0,
      judgment_basis: "成約実績率100.0%が閾値100.0%に到達",
      analysis_timestamp: expect.any(String),
    });

    expect(result.performance_judgment).toBe("優秀");
    expect(result.performance_rate).toBe(100.0);
    expect(result.judgment_basis).toContain("成約実績率100.0%");
    expect(result.judgment_basis).toContain("閾値100.0%");
    expect(result.judgment_basis).toContain("到達");
  });
});