import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-659
  test("チーム平均値の計算対象が1名のみの場合、個別値とチーム平均値の乖離度がちょうど0%となる", () => {
    const sales_rep_id = "rep_001";
    const team_id = "team_001";
    const customer_visits = 15;
    const proposal_count = 8;
    const contract_amount = 5000000;

    const report = generateBehaviorPatternAnalysisReport({
      team_id: team_id,
      sales_reps: [
        {
          sales_rep_id: sales_rep_id,
          customer_visits: customer_visits,
          proposal_count: proposal_count,
          contract_amount: contract_amount,
        },
      ],
    });

    expect(report).toEqual({
      team_id: team_id,
      sales_rep_metrics: [
        {
          sales_rep_id: sales_rep_id,
          individual_customer_visits: customer_visits,
          individual_proposal_count: proposal_count,
          individual_contract_amount: contract_amount,
          team_average_customer_visits: customer_visits,
          team_average_proposal_count: proposal_count,
          team_average_contract_amount: contract_amount,
          deviation_customer_visits_percent: 0,
          deviation_proposal_count_percent: 0,
          deviation_contract_amount_percent: 0,
        },
      ],
    });
  });
});