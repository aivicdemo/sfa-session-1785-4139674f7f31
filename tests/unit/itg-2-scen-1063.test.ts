import { describe, test, expect } from "@jest/globals";
import { validateSalesExampleCollectionDefinition } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1063
  test("最小収集件数が指定されていない場合、エラーが発生する", () => {
    const collectionDefinition = {
      dataType: "sales_example",
      collectionPeriodStart: "2024-01-01T00:00:00Z",
      collectionPeriodEnd: "2024-01-31T23:59:59Z",
      minCollectionCount: undefined,
    };

    expect(() => {
      validateSalesExampleCollectionDefinition(collectionDefinition);
    }).toThrow(/最小収集件数/);
  });
});