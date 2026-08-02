import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-514
  test("重複データの入力順序が逆のとき、同じ重複判定結果が得られる", () => {
    const customerA = {
      customerId: "A001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
    };

    const customerB = {
      customerId: "B001",
      name: "山田太郎",
      email: "yamada@example.com",
      phone: "090-1234-5678",
    };

    const result1 = detectDuplicateCustomers(customerA, customerB);

    const result2 = detectDuplicateCustomers(customerB, customerA);

    expect(result1.isDuplicate).toBe(true);
    expect(result2.isDuplicate).toBe(true);

    expect(result1.similarityScore).toBe(result2.similarityScore);
    expect(result1.similarityScore).toBeGreaterThanOrEqual(95.0);

    expect(result1.mergeGroup).toEqual(result2.mergeGroup);

    expect(result1.recommendedAction).toBe("マージ推奨");
    expect(result2.recommendedAction).toBe("マージ推奨");
  });
});