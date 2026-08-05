import { calculateMonitoringPeriod } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-515
  test("推論精度監視の対象期間が月末日で正しく計算される", () => {
    const current_date = new Date("2024-01-31T23:59:59Z");
    
    const result = calculateMonitoringPeriod(current_date);
    
    const expected_start = new Date("2024-01-01T00:00:00Z");
    const expected_end = new Date("2024-01-31T23:59:59Z");
    
    expect(result.start_date_time).toEqual(expected_start);
    expect(result.end_date_time).toEqual(expected_end);
  });
});