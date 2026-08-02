import { defineBusinessEventLogCollectionPeriod } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業事例データ収集定義エンジン", () => {
  // SCEN-1068
  test("収集対象期間が1日で設定される", () => {
    const startDate = new Date("2024-01-15T00:00:00Z");
    const endDate = new Date("2024-01-15T23:59:59Z");

    const result = defineBusinessEventLogCollectionPeriod({
      collection_start_date: startDate,
      collection_end_date: endDate,
    });

    expect(result.collection_start_date).toEqual(
      new Date("2024-01-15T00:00:00Z")
    );
    expect(result.collection_end_date).toEqual(
      new Date("2024-01-15T23:59:59Z")
    );

    const duration_hours =
      (result.collection_end_date.getTime() -
        result.collection_start_date.getTime()) /
      (1000 * 60 * 60);
    expect(duration_hours).toBeCloseTo(24, 1);
  });
});