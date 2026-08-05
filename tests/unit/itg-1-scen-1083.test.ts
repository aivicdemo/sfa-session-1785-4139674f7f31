import { selectBehaviorAnalysisIndicators } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-1083
  test("行動パターン分析対象指標の自動選定機能 - 対象月の初日から末日までの営業活動ログが正確に集計される", () => {
    const target_year = 2024;
    const target_month = 2;
    const target_month_start = new Date("2024-02-01T00:00:00Z");
    const target_month_end = new Date("2024-02-29T23:59:59Z");

    const activity_logs = [
      {
        id: "log_001",
        salesperson_id: "sp_001",
        activity_date: new Date("2024-02-01T09:00:00Z"),
        activity_type: "initial_contact",
        customer_id: "cust_001",
        notes: "Initial customer contact",
        created_at: new Date("2024-02-01T09:00:00Z"),
      },
      {
        id: "log_002",
        salesperson_id: "sp_001",
        activity_date: new Date("2024-02-14T15:30:00Z"),
        activity_type: "proposal",
        customer_id: "cust_001",
        notes: "Product proposal",
        created_at: new Date("2024-02-14T15:30:00Z"),
      },
      {
        id: "log_003",
        salesperson_id: "sp_001",
        activity_date: new Date("2024-02-29T18:45:00Z"),
        activity_type: "follow_up",
        customer_id: "cust_001",
        notes: "Follow-up call",
        created_at: new Date("2024-02-29T18:45:00Z"),
      },
    ];

    const result = selectBehaviorAnalysisIndicators({
      target_year,
      target_month,
      activity_logs,
    });

    expect(result).toEqual({
      target_month_start: target_month_start,
      target_month_end: target_month_end,
      collected_activity_logs: expect.arrayContaining([
        expect.objectContaining({
          id: "log_001",
          activity_date: new Date("2024-02-01T09:00:00Z"),
        }),
        expect.objectContaining({
          id: "log_002",
          activity_date: new Date("2024-02-14T15:30:00Z"),
        }),
        expect.objectContaining({
          id: "log_003",
          activity_date: new Date("2024-02-29T18:45:00Z"),
        }),
      ]),
      activity_log_count: 3,
      indicators: expect.any(Array),
    });

    expect(result.collected_activity_logs).toHaveLength(3);
    expect(result.activity_log_count).toBe(3);

    const first_log = result.collected_activity_logs[0];
    const last_log = result.collected_activity_logs[2];

    expect(first_log.activity_date.getTime()).toBeGreaterThanOrEqual(
      target_month_start.getTime()
    );
    expect(last_log.activity_date.getTime()).toBeLessThanOrEqual(
      target_month_end.getTime()
    );

    const earliest_date = new Date("2024-02-01T09:00:00Z");
    const latest_date = new Date("2024-02-29T18:45:00Z");

    expect(result.collected_activity_logs.some((log) => log.id === "log_001"))
      .toBe(true);
    expect(result.collected_activity_logs.some((log) => log.id === "log_003"))
      .toBe(true);

    const log_dates = result.collected_activity_logs.map(
      (log) => log.activity_date.getTime()
    );
    expect(log_dates).toContain(earliest_date.getTime());
    expect(log_dates).toContain(latest_date.getTime());
  });
});