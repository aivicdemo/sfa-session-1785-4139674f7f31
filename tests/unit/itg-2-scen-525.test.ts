import { detectDuplicateCustomersWithMandatoryFields } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-525
  test("重複基準に必須判定項目が指定されているとき、その項目が両方の顧客レコードで欠落していれば統合対象外と判定される", () => {
    const mandatoryFields = ["customer_name"];
    const customerRecordA = {
      customer_id: "A001",
      customer_name: null,
      address: "123 Main St",
      phone_number: "555-0001",
    };
    const customerRecordB = {
      customer_id: "B001",
      customer_name: null,
      address: "123 Main St",
      phone_number: "555-0001",
    };

    const result = detectDuplicateCustomersWithMandatoryFields(
      mandatoryFields,
      customerRecordA,
      customerRecordB
    );

    expect(result.is_merge_target).toBe(false);
    expect(result.judgment_reason).toMatch(/必須判定項目.*顧客名.*欠落/);
  });
});