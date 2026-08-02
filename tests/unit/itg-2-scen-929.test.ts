import { describe, test, expect } from "@jest/globals";
import { validatePurchaseHistoryDate } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客購買検討データ入力検証機能", () => {
  // SCEN-929
  test("購買履歴の日付が月末のとき日付検証が正常に実行される", () => {
    const jan_31_2024 = "2024-01-31";
    const feb_29_2024 = "2024-02-29";
    const dec_31_2024 = "2024-12-31";

    const result_jan_31 = validatePurchaseHistoryDate(jan_31_2024);
    expect(result_jan_31).toEqual({
      is_valid: true,
      error_message: null,
    });

    const result_feb_29 = validatePurchaseHistoryDate(feb_29_2024);
    expect(result_feb_29).toEqual({
      is_valid: true,
      error_message: null,
    });

    const result_dec_31 = validatePurchaseHistoryDate(dec_31_2024);
    expect(result_dec_31).toEqual({
      is_valid: true,
      error_message: null,
    });
  });
});