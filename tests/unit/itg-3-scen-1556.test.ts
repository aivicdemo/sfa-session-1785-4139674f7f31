import { findSimilarPatterns } from "../../src/logic/it-1-br-3-3-2-1";

describe("顧客の購買履歴データが空の場合の類似顧客マッチング処理", () => {
  test("SCEN-1556: 購買履歴が空のときエラーが発生する", () => {
    const emptyPurchaseHistoryArray: never[] = [];
    const nullPurchaseHistory: null = null;

    const errorFromEmptyArray = (() => {
      try {
        findSimilarPatterns({
          customerId: "CUST001",
          purchaseHistory: emptyPurchaseHistoryArray,
          proposalContent: {
            productCategory: "enterprise_software",
            estimatedValue: 500000,
            proposalTimestamp: "2024-01-15T10:00:00Z",
          },
        });
        return null;
      } catch (err) {
        return err;
      }
    })();

    expect(errorFromEmptyArray).not.toBeNull();
    expect(errorFromEmptyArray).toHaveProperty("name");
    expect((errorFromEmptyArray as Error).name).toMatch(/ValidationError|validation/i);
    expect((errorFromEmptyArray as Error).message).toMatch(/購買履歴/);
    expect(errorFromEmptyArray).toHaveProperty("code");
    expect((errorFromEmptyArray as Record<string, string>).code).toBe(
      "ERR_EMPTY_PURCHASE_HISTORY"
    );

    const errorFromNull = (() => {
      try {
        findSimilarPatterns({
          customerId: "CUST002",
          purchaseHistory: nullPurchaseHistory,
          proposalContent: {
            productCategory: "enterprise_software",
            estimatedValue: 500000,
            proposalTimestamp: "2024-01-15T10:00:00Z",
          },
        });
        return null;
      } catch (err) {
        return err;
      }
    })();

    expect(errorFromNull).not.toBeNull();
    expect(errorFromNull).toHaveProperty("name");
    expect((errorFromNull as Error).name).toMatch(/ValidationError|validation/i);
    expect((errorFromNull as Error).message).toMatch(/購買履歴/);
    expect(errorFromNull).toHaveProperty("code");
    expect((errorFromNull as Record<string, string>).code).toBe(
      "ERR_EMPTY_PURCHASE_HISTORY"
    );
  });
});