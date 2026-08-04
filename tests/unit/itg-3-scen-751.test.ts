import { validateCustomerDataCompletenessAndValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-751
  test("顧客データ完全性・妥当性判定機能 - 入力されたすべての必須項目が存在し妥当なとき、推奨生成可能と判定される", () => {
    const customerData = {
      customerId: "CUST-001",
      customerName: "株式会社ABC",
      industry: "製造業",
      employeeCount: 500,
      annualBudget: 10000000,
      contactPersonName: "山田太郎",
      contactPersonEmail: "yamada@abc.com",
      currentChallenge: "生産効率化",
      dealStage: "提案段階",
    };

    const result = validateCustomerDataCompletenessAndValidity(customerData);

    expect(result.status).toBe("VALID");
    expect(result.canGenerateRecommendation).toBe(true);
    expect(result.errorMessages).toEqual([]);
    expect(result.validationReason).toContain(
      "全必須項目が存在し、すべての妥当性チェックに合格しました"
    );
  });
});