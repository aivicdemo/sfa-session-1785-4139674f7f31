import { evaluateScheduleCompatibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1325: [normal] 提案内容と顧客制約条件の自動照合機能 - スケジュール期間が提案実装期間より1日少ないとき、スケジュール適合判定が否定で返される", () => {
    const proposalStartDate = new Date("2026-01-01T00:00:00Z");
    const proposalEndDate = new Date("2026-01-31T23:59:59Z");
    const proposalDurationDays = 31;

    const customerScheduleStartDate = new Date("2026-01-01T00:00:00Z");
    const customerScheduleEndDate = new Date("2026-01-30T23:59:59Z");
    const customerScheduleDurationDays = 30;

    const result = evaluateScheduleCompatibility(
      {
        proposalImplementationStartDate: proposalStartDate,
        proposalImplementationEndDate: proposalEndDate,
        proposalRequiredDays: proposalDurationDays,
      },
      {
        customerScheduleStartDate: customerScheduleStartDate,
        customerScheduleEndDate: customerScheduleEndDate,
        customerAvailableDays: customerScheduleDurationDays,
      }
    );

    expect(result.scheduleCompatibility).toBe(false);
    expect(result.reason).toContain("提案実装期間");
    expect(result.reason).toContain("1日");
    expect(result.reason).toContain("超過");
  });
});