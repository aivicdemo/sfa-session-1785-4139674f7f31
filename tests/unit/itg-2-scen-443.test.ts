import { detectAndJudgeDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-443: [normal] 顧客データ重複検出と統合判定 - 顧客名が完全に一致する場合、重複と判定される
  test("顧客名が完全に一致する場合、重複と判定される", () => {
    const existingCustomer = {
      customerId: "CUST-001",
      customerName: "山田太郎",
      email: "yamada@example.com",
      registeredAt: new Date("2024-01-01T09:00:00Z"),
    };

    const duplicateCandidate = {
      customerId: "CUST-002",
      customerName: "山田太郎",
      email: "yamada.taro@example.com",
      registeredAt: new Date("2024-01-15T11:00:00Z"),
    };

    const result = detectAndJudgeDuplicateCustomers(
      existingCustomer,
      duplicateCandidate
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.judgmentStatus).toBe("重複と判定");
    expect(result.mergeCandidate).toEqual({
      primaryCustomerId: "CUST-001",
      secondaryCustomerId: "CUST-002",
      matchingField: "customerName",
      confidence: 1.0,
    });
  });
});