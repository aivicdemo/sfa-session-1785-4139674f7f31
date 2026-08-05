import { generateSalesPersonBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-1048
  test("理解度スコアが0%で周知完了判定が偽になる", () => {
    const sales_person_id = "SP001";
    const understanding_score = 0;
    const guideline_completion_flag = false;
    const contact_frequency = 12;
    const proposal_success_rate = 45;
    const followup_interval_days = 3;
    const process_deviation_score = 15;
    const customer_response_rate = 68;

    const report = generateSalesPersonBehaviorAnalysisReport({
      sales_person_id: sales_person_id,
      understanding_score: understanding_score,
      guideline_completion_flag: guideline_completion_flag,
      contact_frequency: contact_frequency,
      proposal_success_rate: proposal_success_rate,
      followup_interval_days: followup_interval_days,
      process_deviation_score: process_deviation_score,
      customer_response_rate: customer_response_rate,
    });

    expect(report.understanding_score).toBe(0);
    expect(report.guideline_completion_flag).toBe(false);
    expect(report.sales_person_id).toBe("SP001");
    expect(report.contact_frequency).toBe(12);
    expect(report.proposal_success_rate).toBe(45);
    expect(report.followup_interval_days).toBe(3);
    expect(report.process_deviation_score).toBe(15);
    expect(report.customer_response_rate).toBe(68);
  });
});