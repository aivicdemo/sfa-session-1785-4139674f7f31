import { detectCustomerDuplicatesAndMerge } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-620
  test("メールアドレス完全一致で同一顧客と判定される", () => {
    const recordA = {
      customerId: "A001",
      email: "tanaka@example.com",
      customerName: "田中太郎",
      phoneNumber: "090-1111-1111",
    };

    const recordB = {
      customerId: "B002",
      email: "tanaka@example.com",
      customerName: "田中 太郎",
      phoneNumber: "090-2222-2222",
    };

    const result = detectCustomerDuplicatesAndMerge([recordA, recordB]);

    expect(result.duplicateStatus).toBe(true);
    expect(result.matchType).toBe("email_exact_match");
    expect(result.mergedCustomerId).toBe("A001");
    expect(result.mergedRecord).toEqual({
      customerId: "A001",
      email: "tanaka@example.com",
      customerName: "田中太郎",
      phoneNumber: "090-1111-1111",
    });
    expect(result.conflictingFields).toEqual(["name", "phone"]);
  });
});