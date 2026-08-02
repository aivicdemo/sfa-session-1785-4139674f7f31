import { validateAndRevalidateCustomerData } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  // SCEN-434
  test("修正済みデータが空文字列である場合、該当項目を改善必要項目として明示する", () => {
    const corrected_customer_data = {
      customer_id: "CUST-001",
      customer_name: "株式会社テスト",
      email: "",
      phone: "090-1234-5678",
      address: "東京都渋谷区",
      industry: "",
      representative_name: "田中太郎",
    };

    const quality_validation_result = validateAndRevalidateCustomerData(
      corrected_customer_data
    );

    expect(quality_validation_result.status).toBe("IMPROVEMENT_REQUIRED");
    expect(quality_validation_result.needsImprovement).toContain("email");
    expect(quality_validation_result.needsImprovement).toContain("industry");
    expect(quality_validation_result.needsImprovement.length).toBe(2);
  });
});