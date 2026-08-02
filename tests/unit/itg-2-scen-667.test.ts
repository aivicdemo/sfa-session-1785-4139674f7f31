import { describe, test, expect } from "@jest/globals";
import { validateCustomerIdAndFetchRecommendationBasis } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-667
  test("推奨内容根拠の可視化機能 - 入力された顧客IDが無効なとき、エラーが発生する", () => {
    const invalid_customer_ids = ["", null, "abc", "-1", "0"];

    invalid_customer_ids.forEach((customer_id) => {
      expect(() => {
        validateCustomerIdAndFetchRecommendationBasis(customer_id as any);
      }).toThrow(/顧客ID/);
    });
  });
});