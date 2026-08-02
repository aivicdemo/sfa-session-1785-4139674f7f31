import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-134
  test("顧客名が欠落しているレコードは検査対象外に除外される", () => {
    const testDataSet = [
      {
        customerId: "C001",
        customerName: null,
        email: "test1@example.com",
        phone: "09012345678",
      },
      {
        customerId: "C001",
        customerName: "テスト顧客A",
        email: "test1@example.com",
        phone: "09012345678",
      },
      {
        customerId: "C002",
        customerName: "テスト顧客B",
        email: "test2@example.com",
        phone: "09087654321",
      },
    ];

    const result = detectDuplicateCustomers(testDataSet);

    expect(result.duplicateCandidates).toEqual([]);
    expect(result.excludedRecordCount).toBe(1);
    expect(result.processedRecordCount).toBe(2);
  });
});