import { judgeIntegration } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-402
  test("統合判定で確度49%と判定された顧客ペアが除外される", () => {
    const customerPairA = {
      customerIdA: "CUST001",
      nameA: "山田太郎",
      emailA: "yamada@example.com",
      customerIdB: "CUST002",
      nameB: "山田太郎",
      emailB: "yamada.taro@example.com",
    };

    const result = judgeIntegration(customerPairA);

    expect(result.integrationScore).toBe(49);
    expect(result.isExcluded).toBe(true);
    expect(result.mergeCandidates).toEqual([]);
  });
});