import { generateSalesActivityPatternReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  test("SCEN-480: 同じ営業担当者に対して複数回レポート生成を実行した場合、毎回同じレポートが生成される", async () => {
    const salesRepId = "SA001";
    const analysisStartDate = "2024-01-01";
    const analysisEndDate = "2024-01-31";

    // レポート1を生成
    const report1 = await generateSalesActivityPatternReport({
      sales_rep_id: salesRepId,
      start_date: analysisStartDate,
      end_date: analysisEndDate,
    });

    const report1_id = report1.report_id;
    const report1_generated_at = report1.generated_at;
    const report1_analysis_period = report1.analysis_period;
    const report1_sales_activity_count = report1.sales_activity_count;
    const report1_customer_contact_frequency = report1.customer_contact_frequency;
    const report1_proposal_success_rate = report1.proposal_success_rate;

    // レポート2を生成
    const report2 = await generateSalesActivityPatternReport({
      sales_rep_id: salesRepId,
      start_date: analysisStartDate,
      end_date: analysisEndDate,
    });

    const report2_id = report2.report_id;
    const report2_generated_at = report2.generated_at;
    const report2_analysis_period = report2.analysis_period;
    const report2_sales_activity_count = report2.sales_activity_count;
    const report2_customer_contact_frequency = report2.customer_contact_frequency;
    const report2_proposal_success_rate = report2.proposal_success_rate;

    // レポート3を生成
    const report3 = await generateSalesActivityPatternReport({
      sales_rep_id: salesRepId,
      start_date: analysisStartDate,
      end_date: analysisEndDate,
    });

    const report3_id = report3.report_id;
    const report3_generated_at = report3.generated_at;
    const report3_analysis_period = report3.analysis_period;
    const report3_sales_activity_count = report3.sales_activity_count;
    const report3_customer_contact_frequency = report3.customer_contact_frequency;
    const report3_proposal_success_rate = report3.proposal_success_rate;

    // 分析対象期間の一致を確認
    expect(report2_analysis_period).toBe(report1_analysis_period);
    expect(report3_analysis_period).toBe(report1_analysis_period);

    // 営業活動件数の一致を確認
    expect(report2_sales_activity_count).toBe(report1_sales_activity_count);
    expect(report3_sales_activity_count).toBe(report1_sales_activity_count);

    // 顧客接触頻度の一致を確認
    expect(report2_customer_contact_frequency).toBe(
      report1_customer_contact_frequency
    );
    expect(report3_customer_contact_frequency).toBe(
      report1_customer_contact_frequency
    );

    // 提案成功率の一致を確認
    expect(report2_proposal_success_rate).toBe(report1_proposal_success_rate);
    expect(report3_proposal_success_rate).toBe(report1_proposal_success_rate);

    // レポートIDと生成日時は異なることを確認
    expect(report2_id).not.toBe(report1_id);
    expect(report3_id).not.toBe(report1_id);
    expect(report2_id).not.toBe(report3_id);

    expect(report2_generated_at).not.toBe(report1_generated_at);
    expect(report3_generated_at).not.toBe(report1_generated_at);
    expect(report3_generated_at).not.toBe(report2_generated_at);
  });
});