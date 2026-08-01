import { monitorAIInferenceAccuracy } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-428
  test("監視対象となるAIエージェント推論ログが0件の場合、処理が適切に完了する", async () => {
    const agentId = "agent_001";
    const monitoringStartTime = new Date("2024-01-15T09:00:00Z");
    const expectedNextScheduleTime = new Date("2024-01-15T10:00:00Z");

    const result = await monitorAIInferenceAccuracy({
      agentId: agentId,
      monitoringStartTime: monitoringStartTime,
      inferenceLogCount: 0,
      alertGeneratedCount: 0,
      monitoringResultLog: "推論ログ件数：0件",
      nextScheduleMonitoringTime: expectedNextScheduleTime,
    });

    expect(result.statusCode).toBe(200);
    expect(result.completionStatus).toBe("completed");
    expect(result.errorOccurred).toBe(false);
    expect(result.alertGeneratedCount).toBe(0);
    expect(result.monitoringResultLog).toBe("推論ログ件数：0件");
    expect(result.nextScheduleMonitoringTime).toEqual(expectedNextScheduleTime);
  });
});