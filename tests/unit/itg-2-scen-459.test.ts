import { detectDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-459
  test("メールアドレスが空文字列である場合、該当属性を検証対象から除外する", () => {
    const record1 = {
      id: "001",
      name: "太郎",
      email: "",
      phone: "09012345678",
    };

    const record2 = {
      id: "002",
      name: "太郎",
      email: "",
      phone: "09012345678",
    };

    const result = detectDuplicateCustomers([record1, record2]);

    expect(result).toEqual({
      isDuplicate: true,
      duplicatePairs: [
        {
          recordId1: "001",
          recordId2: "002",
          matchedAttributes: ["name", "phone"],
          excludedAttributes: ["email"],
        },
      ],
    });
  });
});