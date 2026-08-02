import { calculateProcessComplianceScore } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-275
  test("標準プロセス遵守度スコア計算 - 初回接触ステップが標準プロセスから1日遅いとき、乖離度として負の値が計算される", () => {
    const sales_activity_start_date = new Date("2024-01-15T00:00:00Z");
    const standard_first_contact_step_days = 0;
    const actual_first_contact_date = new Date("2024-01-16T00:00:00Z");

    const result = calculateProcessComplianceScore({
      sales_activity_start_date,
      standard_first_contact_step_days,
      actual_first_contact_date,
    });

    expect(result.deviation_value).toBe(-1);
  });
});