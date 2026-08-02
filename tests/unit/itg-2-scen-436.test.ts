import { validateQualityAfterCorrection } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジンの構築", () => {
  test("SCEN-436: 修正済みデータがnullである場合、該当項目を改善必要項目として明示する", () => {
    // Prepare test data: sales record with correction target
    const salesRecord = {
      record_id: "REC-001",
      customer_name: null, // Corrected value is null
      email_address: "customer@example.com",
      phone_number: null, // Another null corrected field
      company_size: "large",
      industry: "IT",
    };

    const qualityStandards = {
      customer_name: { required: true, type: "string" },
      email_address: { required: true, type: "string" },
      phone_number: { required: false, type: "string" },
      company_size: { required: true, type: "string" },
      industry: { required: true, type: "string" },
    };

    // Execute quality re-validation
    const validationResult = validateQualityAfterCorrection(
      salesRecord,
      qualityStandards
    );

    // Verify: corrected null values are listed as improvement required items
    expect(validationResult.status).toBe("fail");
    expect(validationResult.improvement_required_items).toContainEqual({
      field_name: "customer_name",
      status: "修正済みデータがnull状態",
    });
    expect(validationResult.improvement_required_items).toContainEqual({
      field_name: "phone_number",
      status: "修正済みデータがnull状態",
    });
    expect(validationResult.improvement_required_items.length).toBe(2);
  });
});