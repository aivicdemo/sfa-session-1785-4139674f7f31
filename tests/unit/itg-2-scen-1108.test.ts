import { validateSalesEventData } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1108
  test("事例データの必須フィールドがすべて入力されている場合、検証に合格する", () => {
    const sampleEventData = {
      customer_name: "株式会社ABC",
      case_name: "システム導入プロジェクト",
      amount: 5000000,
      stage: "成約",
      assigned_person: "営業太郎",
    };

    const result = validateSalesEventData(sampleEventData);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.status).toBe("PASS");
  });
});