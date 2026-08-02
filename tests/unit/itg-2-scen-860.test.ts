import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-860
  test("類似度スコアがちょうど閾値のとき、重複と判定される", () => {
    const threshold = 0.85;
    const customerA = {
      id: "CUST_A_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5678",
      registeredAt: "2024-01-10T09:00:00Z",
    };

    const customerB = {
      id: "CUST_B_001",
      name: "山田太郎",
      address: "東京都渋谷区",
      phone: "090-1234-5679",
      registeredAt: "2024-01-15T10:30:00Z",
    };

    const result = detectDuplicateCustomers({
      registeredCustomer: customerA,
      targetCustomer: customerB,
      similarityThreshold: threshold,
      similarityScore: 0.85,
    });

    expect(result.isDuplicate).toBe(true);
    expect(result.status).toBe("重複");
    expect(result.similarityScore).toBe(0.85);
  });
});