import {
  detectDuplicateCustomersAndJudgeIntegration,
} from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  test("SCEN-113: 重複確度がちょうど80%の場合、統合対象と判定される", () => {
    const customer_a = {
      customer_id: "CUST-001",
      name: "山田太郎",
      phone: "090-1234-5678",
      email: "yamada.taro@example.com",
      address: "東京都渋谷区",
    };

    const customer_b = {
      customer_id: "CUST-002",
      name: "山田太郎",
      phone: "090-1234-5679",
      email: "yamada.taro2@example.com",
      address: "東京都渋谷区",
    };

    const result = detectDuplicateCustomersAndJudgeIntegration(
      customer_a,
      customer_b
    );

    expect(result.duplicate_probability).toBe(80);
    expect(result.should_merge).toBe(true);
    expect(result.merge_status).toBe("MERGEABLE");
  });
});