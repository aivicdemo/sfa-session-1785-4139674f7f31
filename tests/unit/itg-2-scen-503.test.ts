import { detectAndJudgeDuplicateCustomers } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-503
  test("重複スコアが許容閾値超過のとき、統合対象として判定される", () => {
    const customerA = {
      id: "001",
      name: "株式会社ABC",
      email: "contact@abc.com",
      phone: "09012345678",
    };

    const customerB = {
      id: "002",
      name: "ABC株式会社",
      email: "contact@abc.com",
      phone: "09012345678",
    };

    const result = detectAndJudgeDuplicateCustomers(customerA, customerB, 80);

    expect(result).toBe(true);
  });
});