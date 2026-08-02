import { validateCorrectedDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-425
  test("修正済みデータが必須項目を含まない場合、改善必要項目を明示する", () => {
    const corrected_record = {
      customer_id: "CUST001",
      customer_name: "",
      email: "",
      phone: "09012345678",
      address: "東京都渋谷区",
      industry: "IT",
      employee_count: 50,
    };

    const validation_result = validateCorrectedDataQuality(corrected_record);

    expect(validation_result.is_passed).toBe(false);
    expect(validation_result.improvement_items).toEqual([
      {
        field_name: "customer_name",
        error_message: "必須項目が未入力です",
      },
      {
        field_name: "email",
        error_message: "必須項目が未入力です",
      },
    ]);
  });
});