import { normalize } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化 - 正規化ルール適用", () => {
  // SCEN-1038
  test("正規化ルールが適用された顧客データの名前が全角文字に統一される", () => {
    const input_customer_name = "ｶﾀﾛﾑ ABC";
    const result = normalize({ customer_name: input_customer_name });
    expect(result.customer_name).toBe("カタロム ABC");
  });
});