import { calculatePurchaseSignal } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-773
  test("[error] 購買シグナル算出全体 - 商談記録オブジェクトがnullのとき、例外が発生する", () => {
    expect(() => calculatePurchaseSignal(null)).toThrow(
      /InvalidArgumentError|商談記録オブジェクトがnullまたはundefinedです/
    );
  });
});