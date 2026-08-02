import { describe, test, expect } from "@jest/globals";
import { validateCustomerDataQuality } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-369: 顧客情報が1件の場合、その1件に対する検証結果が返される", () => {
    const input_customer = {
      customer_id: "CUST001",
      customer_name: "テスト太郎",
      email: "test@example.com",
    };

    const result = validateCustomerDataQuality(input_customer);

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);

    const validation_result = result[0];
    expect(validation_result).toHaveProperty("customer_id", "CUST001");
    expect(validation_result).toHaveProperty("validation_status");
    expect(typeof validation_result.validation_status).toBe("string");
    expect(validation_result).toHaveProperty("invalid_fields");
    expect(Array.isArray(validation_result.invalid_fields)).toBe(true);
    expect(validation_result).toHaveProperty("validation_timestamp");
    expect(typeof validation_result.validation_timestamp).toBe("string");
  });
});