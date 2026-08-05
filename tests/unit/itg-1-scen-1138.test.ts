import { describe, test, expect } from "@jest/globals";
import { analyzeAndGenerateReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-1138: 成約実績がnullのとき、処理がエラーになること", () => {
    const behavior_pattern = {
      sales_person_id: "SP001",
      visit_count: 15,
      proposal_count: 8,
      followup_interval_days: 3,
      contact_frequency: 5,
      process_compliance_rate: 85,
    };

    const deal_result = null;

    expect(() =>
      analyzeAndGenerateReport(behavior_pattern, deal_result)
    ).toThrow(/成約実績/);
  });
});