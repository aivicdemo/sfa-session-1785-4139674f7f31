import { describe, test, expect } from "@jest/globals";
import { generateSalesPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-378
  test("商談実績データに成約ステータスが欠落しているとき、エラーが発生する", () => {
    const sales_rep_id = "S001";
    const deal_result_data = [
      {
        sales_rep_id: "S001",
        deal_id: "D001",
        contract_status: "成約",
        action_count: 5,
      },
      {
        sales_rep_id: "S001",
        deal_id: "D002",
        contract_status: "失注",
        action_count: 3,
      },
      {
        sales_rep_id: "S001",
        deal_id: "D003",
        contract_status: null,
        action_count: 4,
      },
    ];

    const result = generateSalesPatternAnalysisReport(
      sales_rep_id,
      deal_result_data
    );

    expect(result.error_code).toBe("DATA_VALIDATION_ERROR");
    expect(result.error_message).toMatch(/成約ステータス/);
    expect(result.error_message).toMatch(/S001/);
    expect(result.error_message).toMatch(/D003/);
    expect(result.report_data).toBeNull();
  });
});