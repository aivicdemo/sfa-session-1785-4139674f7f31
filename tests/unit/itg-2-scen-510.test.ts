import { applyNormalizationRules } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-510
  test("正規化ルール適用で電話番号のハイフン区切りが統一される", () => {
    const customerRecordA = {
      id: "CUST_A_001",
      name: "田中太郎",
      phone: "090-1234-5678",
      email: "tanaka@example.com",
    };

    const customerRecordB = {
      id: "CUST_B_001",
      name: "田中太郎",
      phone: "09012345678",
      email: "tanaka@example.com",
    };

    const normalizationRules = [
      {
        field: "phone",
        pattern: /^(\d{3})(\d{4})(\d{4})$/,
        replacement: "$1-$2-$3",
      },
    ];

    const result = applyNormalizationRules(
      [customerRecordA, customerRecordB],
      normalizationRules
    );

    expect(result[0].phone).toBe("090-1234-5678");
    expect(result[1].phone).toBe("090-1234-5678");
    expect(result[0].phone).toEqual(result[1].phone);
  });
});