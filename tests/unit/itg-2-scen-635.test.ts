import { detectCustomerDuplicateWithReason } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-635: 重複判定結果に判定根拠が含まれる", () => {
    const customerA = {
      customer_id: "CUST001",
      last_name: "山田",
      first_name: "太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
      email: "yamada@example.com",
    };

    const customerB = {
      customer_id: "CUST002",
      last_name: "山田",
      first_name: "太郎",
      address: "東京都新宿区",
      phone: "090-9876-5432",
      email: "yamada.taro@example.com",
    };

    const result = detectCustomerDuplicateWithReason(customerA, customerB);

    expect(result.is_duplicate).toBe(true);
    expect(result.duplicate_score).toBe(95);
    expect(result.matching_rule).toBe("姓名完全一致ルール");
    expect(result.matched_fields).toEqual(["姓", "名"]);
    expect(result.reason_detail).toBe(
      "顧客コード異なるが姓名が完全一致のため高確度重複と判定"
    );
  });
});