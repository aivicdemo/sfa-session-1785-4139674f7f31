import { judgeCustomerMerge } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-391
  test("正規化ルールが0件の場合、正規化なしで統合判定が実行される", () => {
    const customerA = {
      customerId: "CUST001",
      customerName: "田中太郎",
      customerKana: "タナカタロウ",
      address: "東京都渋谷区",
      phone: "09012345678",
    };

    const customerB = {
      customerId: "CUST002",
      customerName: "田中 太郎",
      customerKana: "タナカ タロウ",
      address: "東京都渋谷区",
      phone: "09012345678",
    };

    const normalizationRules = [];

    const result = judgeCustomerMerge({
      customer1: customerA,
      customer2: customerB,
      normalizationRules: normalizationRules,
    });

    expect(result.shouldMerge).toBe(false);
    expect(result.mergeJudgment).toBe("統合対象外");
    expect(result.normalizationApplied).toBe(false);
    expect(result.matchScore).toBe(0);
  });
});