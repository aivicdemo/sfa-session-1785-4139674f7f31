import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-204: 電話番号が空のとき、重複判定がスキップされる", () => {
    const customerA = {
      customerId: "CUST-001",
      name: "山田太郎",
      email: "yamada@example.com",
      phoneNumber: "",
      address: "東京都渋谷区",
      registeredAt: "2024-01-15T10:00:00Z",
    };

    const customerB = {
      customerId: "CUST-002",
      name: "山田太郎",
      email: "yamada@example.com",
      phoneNumber: "09012345678",
      address: "大阪府大阪市",
      registeredAt: "2024-01-16T10:00:00Z",
    };

    const executionLog: string[] = [];

    const result = detectDuplicateCustomers(customerA, customerB, executionLog);

    expect(result).toEqual({
      duplicateCheckStatus: "skipped",
      reason: "phoneNumber is empty",
      isDuplicate: false,
    });

    expect(executionLog).toContain(
      "Phone number validation skipped due to empty value"
    );
  });
});