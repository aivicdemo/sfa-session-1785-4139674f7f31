import { describe, test, expect } from "@jest/globals";
import { validateCollectionDefinition } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業事例データ収集定義エンジン", () => {
  // SCEN-1065
  test("収集対象期間が0日の場合、エラーが発生する", () => {
    const collectionDefinition = {
      collectionPeriodDays: 0,
      minEventCount: 10,
      dataItems: ["customer_name", "deal_amount", "outcome"],
    };

    expect(() => validateCollectionDefinition(collectionDefinition)).toThrow(
      /PERIOD_INVALID/
    );
  });
});