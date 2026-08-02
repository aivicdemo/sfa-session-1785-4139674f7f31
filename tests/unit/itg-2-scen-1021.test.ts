import { validateDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1021
  test("顧客対応記録のテキスト項目が指定文字数の上限に達する場合に形式検証が成功する", () => {
    const maxCharCount = 2000;
    const textAt2000Chars = "a".repeat(maxCharCount);

    const customerContactRecord = {
      id: "rec-001",
      customerId: "cust-001",
      contactDate: new Date("2024-01-15T10:00:00Z"),
      contactType: "meeting",
      notes: textAt2000Chars,
      attendees: "営業担当者A",
      nextAction: "提案資料送付",
    };

    const result = validateDataQuality(customerContactRecord);

    expect(result.successful).toBe(true);
    expect(result.errorMessages).toEqual([]);
  });
});