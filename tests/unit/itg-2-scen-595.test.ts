import { validateDataConsistency } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-595
  test("一貫性検証で顧客ID参照先がマスタに存在しない場合、不合格と判定される", () => {
    const customerMasterRecords = [
      { customer_id: "C001", customer_name: "顧客A" },
      { customer_id: "C002", customer_name: "顧客B" },
    ];

    const salesDataRecords = [
      {
        sales_id: "S001",
        customer_id: "C003",
        amount: 100000,
      },
    ];

    const result = validateDataConsistency(
      customerMasterRecords,
      salesDataRecords
    );

    expect(result.status).toBe("不合格");
    expect(result.error_message).toContain("顧客ID:C003はマスタに存在しません");
    expect(result.error_count).toBe(1);
  });
});