import { describe, test, expect } from "@jest/globals";
import { generateSalesProcessComplianceReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス標準書の妥当性検証と改善 - 営業事例の知識化と成功パターン共有", () => {
  // SCEN-1012: [normal] 営業部長への報告データ生成機能 - 理解度スコアと実務適用状況が正しく組み合わされて営業部長への報告データが生成される
  test("should generate report data for executives with correct comprehension scores and application status combinations", () => {
    const sales_staff_1 = {
      sales_staff_id: "staff_001",
      name: "営業担当者A",
      comprehension_score: 80,
      application_status: "適用済み" as const,
    };

    const sales_staff_2 = {
      sales_staff_id: "staff_002",
      name: "営業担当者B",
      comprehension_score: 60,
      application_status: "部分適用" as const,
    };

    const sales_staff_3 = {
      sales_staff_id: "staff_003",
      name: "営業担当者C",
      comprehension_score: 40,
      application_status: "未適用" as const,
    };

    const input_data = [sales_staff_1, sales_staff_2, sales_staff_3];

    const report_result = generateSalesProcessComplianceReport(input_data);

    expect(report_result).toBeDefined();
    expect(Array.isArray(report_result.staff_entries)).toBe(true);
    expect(report_result.staff_entries.length).toBe(3);

    const entry_1 = report_result.staff_entries[0];
    expect(entry_1.sales_staff_id).toBe("staff_001");
    expect(entry_1.name).toBe("営業担当者A");
    expect(entry_1.comprehension_score).toBe(80);
    expect(entry_1.application_status).toBe("適用済み");

    const entry_2 = report_result.staff_entries[1];
    expect(entry_2.sales_staff_id).toBe("staff_002");
    expect(entry_2.name).toBe("営業担当者B");
    expect(entry_2.comprehension_score).toBe(60);
    expect(entry_2.application_status).toBe("部分適用");

    const entry_3 = report_result.staff_entries[2];
    expect(entry_3.sales_staff_id).toBe("staff_003");
    expect(entry_3.name).toBe("営業担当者C");
    expect(entry_3.comprehension_score).toBe(40);
    expect(entry_3.application_status).toBe("未適用");

    expect(report_result.generated_at).toBeDefined();
    expect(typeof report_result.generated_at).toBe("string");

    expect(report_result.total_count).toBe(3);
    expect(report_result.applied_count).toBe(1);
    expect(report_result.partially_applied_count).toBe(1);
    expect(report_result.unapplied_count).toBe(1);
  });
});