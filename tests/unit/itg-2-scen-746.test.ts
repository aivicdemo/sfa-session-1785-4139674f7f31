import { calculatePurchasingSignalStrength } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-746: 購買シグナル強度算出機能 - 最終接触日が空のときの計算", () => {
    // 最終接触日がnullの場合
    const salesDataWithNullLastContact = {
      customerId: "CUST-001",
      companyName: "Test Company",
      pastContactCount: 5,
      averagePurchaseAmount: 150000,
      lastContactDate: null as any,
      purchaseCycle: 90,
    };

    const resultWithNull = calculatePurchasingSignalStrength(
      salesDataWithNullLastContact
    );

    expect(typeof resultWithNull).toBe("number");
    expect(resultWithNull).toBeGreaterThanOrEqual(0);
    expect(resultWithNull).toBeLessThanOrEqual(100);

    // 最終接触日が空文字列の場合
    const salesDataWithEmptyLastContact = {
      customerId: "CUST-002",
      companyName: "Another Company",
      pastContactCount: 3,
      averagePurchaseAmount: 200000,
      lastContactDate: "",
      purchaseCycle: 60,
    };

    const resultWithEmpty = calculatePurchasingSignalStrength(
      salesDataWithEmptyLastContact
    );

    expect(typeof resultWithEmpty).toBe("number");
    expect(resultWithEmpty).toBeGreaterThanOrEqual(0);
    expect(resultWithEmpty).toBeLessThanOrEqual(100);

    // 両方の結果が有効な値であることを確認
    expect(Number.isNaN(resultWithNull)).toBe(false);
    expect(Number.isNaN(resultWithEmpty)).toBe(false);
  });
});