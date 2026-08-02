import { describe, test, expect } from "@jest/globals";
import { validateSalesDataFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  test("SCEN-1122: 事例データのテキスト長が上限を超過している場合、形式検証に不合格となる", () => {
    const MAX_TEXT_LENGTH = 1000;
    const EXCEEDED_TEXT_LENGTH = 1001;
    const exceeded_text = "a".repeat(EXCEEDED_TEXT_LENGTH);

    const sales_data = {
      case_id: "CASE001",
      case_text: exceeded_text,
      max_text_length: MAX_TEXT_LENGTH,
    };

    const validation_result = validateSalesDataFormat(sales_data);

    expect(validation_result.status).toBe("NG");
    expect(validation_result.error_code).toBe("TEXT_LENGTH_EXCEEDED");
    expect(validation_result.is_valid).toBe(false);
    expect(validation_result.message).toMatch(/テキスト長/);
  });
});