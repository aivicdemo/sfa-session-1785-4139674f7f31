import { describe, test, expect } from "@jest/globals";
import { validateSalesAmountForAuditDashboard } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-578
  test("営業案件の営業金額が0未満の場合、エラーになる", () => {
    const salesProject = {
      sales_project_id: "proj_001",
      customer_id: "cust_001",
      sales_representative_id: "rep_001",
      project_name: "プロジェクトA",
      sales_amount: -100000,
      project_status: "in_progress",
      created_date: "2024-01-15T10:00:00Z",
      updated_date: "2024-01-15T10:00:00Z",
    };

    expect(() => validateSalesAmountForAuditDashboard(salesProject)).toThrow(
      /営業金額/
    );
  });
});