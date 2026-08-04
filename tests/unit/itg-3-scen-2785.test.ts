import { extractAndWeightSuccessPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けロジック", () => {
  // SCEN-2785
  test("顧客規模が0以下のレコードが含まれるとき、エラーを返す", () => {
    const invalidRecords = [
      {
        index: 0,
        dealId: "deal-001",
        customerId: "cust-001",
        customerSize: 0,
        industry: "IT",
        success: true,
        successFactors: ["factor-a"],
      },
      {
        index: 1,
        dealId: "deal-002",
        customerId: "cust-002",
        customerSize: 100,
        industry: "Finance",
        success: true,
        successFactors: ["factor-b"],
      },
      {
        index: 2,
        dealId: "deal-003",
        customerId: "cust-003",
        customerSize: -5,
        industry: "Retail",
        success: false,
        successFactors: ["factor-c"],
      },
    ];

    expect(() => extractAndWeightSuccessPatterns(invalidRecords)).toThrow(
      /顧客規模/
    );
  });
});