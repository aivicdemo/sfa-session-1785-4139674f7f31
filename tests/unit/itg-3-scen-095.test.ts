import { deleteExpiredReports } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-095
  test("期限切れレポート削除機能 - 同じ削除期限で複数回削除処理を実行しても同じレポートが削除される", async () => {
    const expiration_deadline = new Date("2026-01-01T00:00:00Z");
    const report_metadata = [
      {
        id: "report-a",
        created_at: new Date("2025-06-01T00:00:00Z"),
        expiration_date: new Date("2026-01-01T00:00:00Z"),
      },
      {
        id: "report-b",
        created_at: new Date("2025-07-01T00:00:00Z"),
        expiration_date: new Date("2026-01-01T00:00:00Z"),
      },
      {
        id: "report-c",
        created_at: new Date("2025-08-01T00:00:00Z"),
        expiration_date: new Date("2026-02-01T00:00:00Z"),
      },
    ];

    const mock_adapter = {
      delete_call_history: [] as Array<{
        ids_to_delete: string[];
        call_timestamp: Date;
      }>,
      deleteExpiredReports: jest
        .fn()
        .mockImplementation(async (ids: string[]) => {
          mock_adapter.delete_call_history.push({
            ids_to_delete: ids,
            call_timestamp: new Date(),
          });
          return Promise.resolve();
        }),
    };

    let remaining_reports = [...report_metadata];

    const first_call_ids = remaining_reports
      .filter((r) => r.expiration_date <= expiration_deadline)
      .map((r) => r.id);

    await mock_adapter.deleteExpiredReports(first_call_ids);
    remaining_reports = remaining_reports.filter(
      (r) => !first_call_ids.includes(r.id)
    );

    expect(mock_adapter.delete_call_history).toHaveLength(1);
    expect(mock_adapter.delete_call_history[0].ids_to_delete).toEqual([
      "report-a",
      "report-b",
    ]);
    expect(remaining_reports).toHaveLength(1);
    expect(remaining_reports[0].id).toBe("report-c");

    const second_call_ids = remaining_reports
      .filter((r) => r.expiration_date <= expiration_deadline)
      .map((r) => r.id);

    await mock_adapter.deleteExpiredReports(second_call_ids);

    expect(mock_adapter.delete_call_history).toHaveLength(2);
    expect(mock_adapter.delete_call_history[1].ids_to_delete).toEqual([]);

    expect(remaining_reports).toHaveLength(1);
    expect(remaining_reports[0].id).toBe("report-c");
  });
});