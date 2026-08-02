import { calculatePurchaseSignal } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-772: 購買シグナル算出全体 - 顧客IDが空文字のとき、例外が発生する", () => {
    expect(() => {
      calculatePurchaseSignal({
        customerId: "",
        lastContactDate: new Date("2024-01-15"),
        purchaseCycle: 30,
        responsePattern: "positive",
      });
    }).toThrow(/顧客ID/);
  });
});