import { validatePurchaseHistoryCompleteness } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-887
  test("購買履歴データが0件のとき完全性検証を実行して不足警告を返す", () => {
    const purchase_history: Array<{
      purchase_id: string;
      purchase_date: string;
      amount: number;
    }> = [];

    const result = validatePurchaseHistoryCompleteness({
      purchase_history: purchase_history,
    });

    expect(result.validation_level).toBe("WARNING");
    expect(result.validation_code).toBe("INCOMPLETE_PURCHASE_HISTORY");
    expect(result.message).toBe(
      "購買履歴が登録されていません。顧客の購買検討段階を判定できません"
    );
  });
});