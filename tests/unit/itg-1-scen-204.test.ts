import { analyzeBusinessActivityPatterns } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-204
  test("集計対象期間の開始日と終了日が同日である場合、その日付のデータのみが対象となる", () => {
    const start_date = new Date("2024-01-15T00:00:00Z");
    const end_date = new Date("2024-01-15T23:59:59Z");

    const activity_data = [
      {
        date: new Date("2024-01-15T10:30:00Z"),
        visits: 5,
        proposals: 3,
        contracts: 1,
      },
      {
        date: new Date("2024-01-14T10:30:00Z"),
        visits: 2,
        proposals: 1,
        contracts: 0,
      },
      {
        date: new Date("2024-01-16T10:30:00Z"),
        visits: 3,
        proposals: 2,
        contracts: 1,
      },
    ];

    const result = analyzeBusinessActivityPatterns(
      activity_data,
      start_date,
      end_date
    );

    expect(result.total_visits).toBe(5);
    expect(result.total_proposals).toBe(3);
    expect(result.total_contracts).toBe(1);
    expect(result.period_start).toEqual(start_date);
    expect(result.period_end).toEqual(end_date);
    expect(result.records_included).toBe(1);
  });
});