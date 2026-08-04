import { validateDealDataCompleteness } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-718: [error] 推奨生成前データ完全性判定機能 - 顧客名が空のとき推奨生成不可と判定される", () => {
    const dealData = {
      deal_id: "DEAL-001",
      customer_name: "",
      deal_status: "initial_proposal",
      industry: "IT",
      company_size: "large",
    };

    const result = validateDealDataCompleteness(dealData);

    expect(result.is_valid).toBe(false);
    expect(result.error_code).toBeDefined();
    expect(result.error_message).toMatch(/顧客名/);
  });
});