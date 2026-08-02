import { recordPurchaseResult } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-963
  test("[edge] 購買結果記録・営業データ統合機能 - 購買金額が0円の場合でも記録される", async () => {
    const input = {
      customerId: "TEST-001",
      productId: "PROD-101",
      purchaseAmount: 0,
      purchaseDateTime: "2024-01-15T10:30:00Z",
    };

    const result = await recordPurchaseResult(input);

    expect(result.customerId).toBe("TEST-001");
    expect(result.productId).toBe("PROD-101");
    expect(result.purchaseAmount).toBe(0);
    expect(result.purchaseDateTime).toBe("2024-01-15T10:30:00Z");
    expect(result.status).toBe("completed");
  });
});