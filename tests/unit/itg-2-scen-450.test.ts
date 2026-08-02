import { detectCustomerDuplicateWithNormalization } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-450
  test("正規化ルール適用後にメールアドレスが完全に一致する場合、重複と判定される", () => {
    const customerA = {
      id: "cust_001",
      email: " SALES@EXAMPLE.COM ",
      name: "Customer A",
    };

    const customerB = {
      id: "cust_002",
      email: "sales@example.com",
      name: "Customer B",
    };

    const normalizationRules = [
      {
        field: "email",
        transformations: [
          { type: "trim" as const },
          { type: "toLowerCase" as const },
        ],
      },
    ];

    const result = detectCustomerDuplicateWithNormalization(
      customerA,
      customerB,
      normalizationRules
    );

    expect(result.isDuplicate).toBe(true);
    expect(result.status).toBe("duplicate");
    expect(result.duplicateKeys).toContain("email");
    expect(result.normalizedValueA).toBe("sales@example.com");
    expect(result.normalizedValueB).toBe("sales@example.com");
  });
});