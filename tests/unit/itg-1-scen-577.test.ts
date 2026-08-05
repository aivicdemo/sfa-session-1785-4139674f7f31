import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-577
  test("営業案件の営業金額が欠落している場合、エラーになる", async () => {
    const { validateSalesProjectForAuditDashboard } = await import(
      "../../src/logic/it-1"
    );

    const invalidSalesProject = {
      sales_project_id: "PRJ-2024-001",
      customer_id: "CUST-0001",
      sales_representative_id: "REP-0001",
      project_name: "顧客A向けシステム提案",
      sales_amount: null,
      status: "提案中",
      expected_close_date: "2024-06-30",
    };

    expect(() => {
      validateSalesProjectForAuditDashboard(invalidSalesProject);
    }).toThrow(/営業金額/);
  });
});