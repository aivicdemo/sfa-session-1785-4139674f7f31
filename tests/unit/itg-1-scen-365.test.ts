import { generateSystemHealthCheckReport } from "../../src/logic/it-1";

describe("営業プロセス実行状況の監査ダッシュボード", () => {
  test("SCEN-365: システムヘルスチェック結果レポート生成機能 - システム稼働率の端数が発生する場合に適切に丸められてレポートに反映される", () => {
    // Arrange
    const mock_uptime_percentage = 99.9567;
    const expected_rounded_uptime = 99.96;

    const mock_system_health_data = {
      uptime_percentage: mock_uptime_percentage,
      check_timestamp: "2024-01-15T11:00:00Z",
      system_status: "operational",
      data_quality_score: 95.5,
      ai_inference_accuracy: 94.3,
    };

    // Act
    const generated_report = generateSystemHealthCheckReport(
      mock_system_health_data
    );

    // Assert
    expect(generated_report.uptime_percentage).toBe(expected_rounded_uptime);
    expect(typeof generated_report.uptime_percentage).toBe("number");
    expect(generated_report).toHaveProperty("check_timestamp");
    expect(generated_report).toHaveProperty("system_status");
    expect(generated_report.system_status).toBe("operational");
  });
});