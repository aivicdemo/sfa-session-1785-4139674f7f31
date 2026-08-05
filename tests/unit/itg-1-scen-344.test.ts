import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import {
  generateSalesPersonBehaviorAnalysisReport,
  SalesPersonBehaviorAnalysisReportInput,
  SalesPersonBehaviorAnalysisReportOutput,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者行動パターン分析レポート生成機能", () => {
  // SCEN-344
  test("成約実績データが存在しないとき、エラーコードERR_SALES_NO_PERFORMANCE_DATAを返す", () => {
    const input: SalesPersonBehaviorAnalysisReportInput = {
      sales_person_id: "SP001",
      analysis_start_date: "2024-01-01",
      analysis_end_date: "2024-01-31",
    };

    const result: SalesPersonBehaviorAnalysisReportOutput =
      generateSalesPersonBehaviorAnalysisReport(input);

    expect(result.success).toBe(false);
    expect(result.error_code).toBe("ERR-SALES-NO-PERFORMANCE-DATA");
    expect(result.error_message).toMatch(/指定された期間の成約実績データが見つかりません/);
    expect(result.report_data).toBeUndefined();
  });
});