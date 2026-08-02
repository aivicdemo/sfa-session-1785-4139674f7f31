import { defineBusinessEventCollectionPeriod } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業事例データ収集定義エンジン", () => {
  // SCEN-1074
  test("開始日と終了日が同日で設定される場合、1日間の収集期間として正常に処理される", () => {
    const start_date = new Date("2024-01-15T00:00:00Z");
    const end_date = new Date("2024-01-15T00:00:00Z");

    const result = defineBusinessEventCollectionPeriod({
      start_date: start_date,
      end_date: end_date,
    });

    expect(result.collection_days).toBe(1);
    expect(result.is_valid).toBe(true);
    expect(result.start_date).toEqual(start_date);
    expect(result.end_date).toEqual(end_date);
  });
});