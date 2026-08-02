import { validateSalesDataFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1120
  test("事例データのテキスト長が上限以内である場合、形式検証に合格する", () => {
    const case_data = {
      case_id: "CASE-001",
      case_text: "A".repeat(1000),
      case_type: "success_pattern",
      created_at: "2024-01-15T10:00:00Z",
    };

    const result = validateSalesDataFormat(case_data);

    expect(result.status).toBe("PASS");
    expect(result.error_message).toBe("");
    expect(result.judgement).toBe("合格");
  });
});