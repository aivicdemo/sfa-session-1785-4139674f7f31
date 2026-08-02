import { validateSalesDataFormat } from "../../src/logic/it-1-br-2-1-2-1";

describe("営業データ品質検証エンジン", () => {
  // SCEN-1116
  test("事例データの日付形式がISO 8601準拠の場合、形式検証に合格する", () => {
    const case_data = {
      case_id: "CASE-001",
      case_date: "2024-01-15T09:30:00Z",
      case_title: "顧客A向け提案成功事例",
      case_amount: 5000000,
      case_status: "成約"
    };

    const result = validateSalesDataFormat(case_data);

    expect(result.status).toBe("PASS");
    expect(result.errors).toEqual([]);
    expect(result.date_format_compliant).toBe(true);
  });
});