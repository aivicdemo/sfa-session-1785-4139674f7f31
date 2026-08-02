import { defineBusinessEventCollectionPeriod } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業事例データ収集定義エンジン", () => {
  // SCEN-1076
  test("収集対象期間が年度をまたいで設定される", () => {
    const startDate = new Date("2023-04-01T00:00:00Z");
    const endDate = new Date("2024-03-31T23:59:59Z");

    const collectionDefinition = defineBusinessEventCollectionPeriod({
      periodStartDate: startDate,
      periodEndDate: endDate,
    });

    expect(collectionDefinition.periodStartDate).toEqual(
      new Date("2023-04-01T00:00:00Z")
    );
    expect(collectionDefinition.periodEndDate).toEqual(
      new Date("2024-03-31T23:59:59Z")
    );
    expect(collectionDefinition.isCrossFiscalYear).toBe(true);
    expect(collectionDefinition.fiscalYears).toEqual([2023, 2024]);
  });
});