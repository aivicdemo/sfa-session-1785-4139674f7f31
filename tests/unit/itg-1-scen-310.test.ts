import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  // SCEN-310: [normal] システムヘルスチェック判定機能 - チェック対象が複数件の場合に全件がレポートに含まれる
  it("should include all health check items in the report when multiple check targets are provided", async () => {
    // Import the health check report generation function
    const { generateHealthCheckReport } = await import(
      "../../src/logic/it-1"
    );

    // Setup: Mock the health check results for the three targets
    const database_check_result = {
      check_target_name: "データベース接続状態",
      check_status: "正常",
      check_executed_at: new Date("2024-01-15T10:00:00Z"),
      detail_message: "Database connection is healthy",
    };

    const external_api_check_result = {
      check_target_name: "外部API応答性",
      check_status: "警告",
      check_executed_at: new Date("2024-01-15T10:00:15Z"),
      detail_message: "API response time is 2.5 seconds, approaching threshold",
    };

    const storage_check_result = {
      check_target_name: "ストレージ容量状態",
      check_status: "異常",
      check_executed_at: new Date("2024-01-15T10:00:30Z"),
      detail_message: "Storage capacity at 95%, critical level reached",
    };

    const health_check_items = [
      database_check_result,
      external_api_check_result,
      storage_check_result,
    ];

    // Execute: Generate the health check report
    const generated_report = generateHealthCheckReport(health_check_items);

    // Verify: Check that all three health check items are included in the report
    expect(generated_report.check_items).toHaveLength(3);

    // Verify: Check that the first item (database) is correctly recorded
    expect(generated_report.check_items[0]).toEqual({
      check_target_name: "データベース接続状態",
      check_status: "正常",
      check_executed_at: new Date("2024-01-15T10:00:00Z"),
      detail_message: "Database connection is healthy",
    });

    // Verify: Check that the second item (external API) is correctly recorded
    expect(generated_report.check_items[1]).toEqual({
      check_target_name: "外部API応答性",
      check_status: "警告",
      check_executed_at: new Date("2024-01-15T10:00:15Z"),
      detail_message: "API response time is 2.5 seconds, approaching threshold",
    });

    // Verify: Check that the third item (storage) is correctly recorded
    expect(generated_report.check_items[2]).toEqual({
      check_target_name: "ストレージ容量状態",
      check_status: "異常",
      check_executed_at: new Date("2024-01-15T10:00:30Z"),
      detail_message: "Storage capacity at 95%, critical level reached",
    });

    // Verify: Check that each item has the required fields
    generated_report.check_items.forEach((item: any) => {
      expect(item).toHaveProperty("check_target_name");
      expect(item).toHaveProperty("check_status");
      expect(item).toHaveProperty("check_executed_at");
      expect(["正常", "警告", "異常"]).toContain(item.check_status);
      expect(item.check_executed_at).toBeInstanceOf(Date);
    });

    // Verify: Check that the report contains all three checks
    const report_check_names = generated_report.check_items.map(
      (item: any) => item.check_target_name
    );
    expect(report_check_names).toContain("データベース接続状態");
    expect(report_check_names).toContain("外部API応答性");
    expect(report_check_names).toContain("ストレージ容量状態");

    // Verify: Check that the report has correct status summary
    expect(generated_report.overall_status_summary).toEqual({
      normal_count: 1,
      warning_count: 1,
      abnormal_count: 1,
    });
  });
});