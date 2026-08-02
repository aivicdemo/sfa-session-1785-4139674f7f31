import { describe, test, expect } from "@jest/globals";
import { validateSalesDataConsistency } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-597: 複数の矛盾が存在する場合、すべてが検出される", () => {
    const salesRecord = {
      customer_name: "",
      sales_amount: -50000,
      contract_date: "2024-12-31",
      end_date: "2024-01-01",
      sales_rep_id: "NON_EXISTENT_ID_12345",
    };

    const validation_result = validateSalesDataConsistency(salesRecord);

    expect(validation_result.has_errors).toBe(true);
    expect(validation_result.error_count).toBe(4);
    expect(validation_result.errors).toHaveLength(4);

    const error_messages = validation_result.errors.map(
      (err: { field: string; message: string }) => err.message
    );

    expect(error_messages).toContain(expect.stringMatching(/顧客名は必須項目です/));
    expect(error_messages).toContain(
      expect.stringMatching(/売上金額は0以上である必要があります/)
    );
    expect(error_messages).toContain(
      expect.stringMatching(/契約日は終了日以前である必要があります/)
    );
    expect(error_messages).toContain(
      expect.stringMatching(/営業担当者IDが見つかりません/)
    );

    const error_fields = validation_result.errors.map(
      (err: { field: string; message: string }) => err.field
    );

    expect(error_fields).toContain("customer_name");
    expect(error_fields).toContain("sales_amount");
    expect(error_fields).toContain("contract_date");
    expect(error_fields).toContain("sales_rep_id");

    const inconsistency_types = validation_result.errors.map(
      (err: { inconsistency_type?: string }) => err.inconsistency_type
    );

    expect(inconsistency_types).toContain("required_field");
    expect(inconsistency_types).toContain("value_range");
    expect(inconsistency_types).toContain("date_logical");
    expect(inconsistency_types).toContain("reference_integrity");
  });
});