import { mergeCustomerDuplicates } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-1182
  test("統合判定で1件の顧客データのみが入力された場合、統合対象がないというエラーが返される", () => {
    const single_customer_input = [
      {
        customer_id: "C001",
        customer_name: "山田太郎",
      },
    ];

    expect(() => mergeCustomerDuplicates(single_customer_input)).toThrow(
      /統合対象/
    );
  });
});