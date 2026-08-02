import { detectDuplicatesAndInconsistencies } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化", () => {
  // SCEN-1042
  test("顧客データの顧客名が欠けている場合に重複判定エラーとして処理される", () => {
    const customer_with_missing_name = {
      customer_id: "CUST001",
      customer_name: "",
      email: "test@example.com",
      phone_number: "09012345678",
    };

    expect(() =>
      detectDuplicatesAndInconsistencies([customer_with_missing_name])
    ).toThrow(/顧客名/);
  });
});