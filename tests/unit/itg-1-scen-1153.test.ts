import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  generateSalesActivityPatternAnalysisReport,
  type GenerateSalesActivityPatternAnalysisReportInput,
  type SalesActivityPatternAnalysisReport,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1153
  test("分析対象期間の開始日と終了日が同日のとき分析が実行される", () => {
    const start_date = new Date("2024-01-15T00:00:00Z");
    const end_date = new Date("2024-01-15T23:59:59Z");

    const input: GenerateSalesActivityPatternAnalysisReportInput = {
      start_date,
      end_date,
      sales_rep_id: "sales_rep_001",
    };

    const result: SalesActivityPatternAnalysisReport =
      generateSalesActivityPatternAnalysisReport(input);

    expect(result).toBeDefined();
    expect(result.analysis_status).toBe("completed");
    expect(result.target_period_start).toEqual(start_date);
    expect(result.target_period_end).toEqual(end_date);
    expect(result.target_period_display).toBe("2024年01月15日～2024年01月15日");
    expect(result.sales_rep_id).toBe("sales_rep_001");
    expect(result.daily_visit_count).toBeGreaterThanOrEqual(0);
    expect(result.daily_meeting_count).toBeGreaterThanOrEqual(0);
    expect(result.daily_activity_hours).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.activity_records)).toBe(true);
  });
});