import { validateCustomerDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-703
  test("[normal] 顧客データ完全性・妥当性判定機能 - 顧客名、業種、規模、商談予定日のすべてが入力されている場合、データ妥当性チェック処理が実行される", () => {
    const customerData = {
      customerName: "株式会社ABC",
      industry: "製造業",
      scale: "従業員500名",
      plannedMeetingDate: "2026-09-15",
    };

    const result = validateCustomerDataCompleteness(customerData);

    expect(result.isValid).toBe(true);
    expect(result.validatedFields).toEqual({
      customerName: "入力済み",
      industry: "入力済み",
      scale: "入力済み",
      plannedMeetingDate: "入力済み",
    });
    expect(result.validationLog).toContain("顧客名:入力済み");
    expect(result.validationLog).toContain("業種:入力済み");
    expect(result.validationLog).toContain("規模:入力済み");
    expect(result.validationLog).toContain("商談予定日:入力済み");
    expect(result.readyForRecommendation).toBe(true);
  });
});