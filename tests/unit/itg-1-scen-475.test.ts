import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-475
  test("営業担当者の成約実績が1件の場合、その1件に基づいて成約率が計算される", () => {
    const sales_person_id = "SP001";
    const sales_person_name = "営業担当者A";
    const contract_count = 1;
    const contact_count = 10;
    const contract_amount = 1000000;

    const input_data = {
      sales_person_id,
      sales_person_name,
      contract_count,
      contact_count,
      contract_amount,
    };

    const report = generateSalesPersonBehaviorAnalysisReport(input_data);

    const expected_contract_rate = 10;

    expect(report.contract_rate).toBe(expected_contract_rate);
    expect(report.sales_person_id).toBe(sales_person_id);
    expect(report.sales_person_name).toBe(sales_person_name);
    expect(report.contract_count).toBe(contract_count);
    expect(report.contact_count).toBe(contact_count);
    expect(report.contract_amount).toBe(contract_amount);
  });
});