import { normalizeCustomerData } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-143
  test("定義された正規化ルール1件のとき、該当レコードが正規化される", () => {
    const normalization_rules = [
      {
        rule_id: "rule_001",
        rule_name: "電話番号ハイフン除去",
        target_field: "phone",
        processing_content: "-を削除",
      },
    ];

    const input_record = {
      customer_id: "cust_001",
      customer_name: "顧客A",
      phone: "090-1234-5678",
    };

    const result = normalizeCustomerData(input_record, normalization_rules);

    expect(result.phone).toBe("09012345678");
  });
});