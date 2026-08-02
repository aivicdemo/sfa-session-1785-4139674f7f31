import { initializeSalesExampleCollectionEngine, generateSalesExampleCollectionDefinition } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-1067
  test("必須データ項目が0個の場合、エラーが発生する", () => {
    const engine = initializeSalesExampleCollectionEngine();
    const requiredFields: string[] = [];

    expect(() => {
      generateSalesExampleCollectionDefinition(engine, requiredFields);
    }).toThrow(/REQUIRED_FIELDS_EMPTY/);
  });
});