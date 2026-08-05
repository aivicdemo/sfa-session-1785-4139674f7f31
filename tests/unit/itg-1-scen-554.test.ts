import { analyzeActionPatternAndGenerateReport } from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の行動パターンと成約実績の自動分析・レポート機能", () => {
  test("SCEN-554: 成約実績の成約日が欠落している場合、エラーになる", () => {
    // テストデータ準備: 成約日が null の成約実績レコード
    const actionPatternData = {
      sales_rep_id: "REP-001",
      contact_frequency: 5,
      proposal_count: 3,
      follow_up_interval_days: 7,
      process_compliance_score: 85,
    };

    const closedDealsData = [
      {
        deal_id: "DEAL-001",
        sales_rep_id: "REP-001",
        closed_amount: 500000,
        closed_date: null, // 成約日が欠落
        deal_status: "won",
      },
    ];

    const standardProcessSteps = [
      { step_id: 1, step_name: "初回接触", required: true },
      { step_id: 2, step_name: "提案", required: true },
      { step_id: 3, step_name: "交渉", required: true },
      { step_id: 4, step_name: "成約", required: true },
    ];

    // 関数実行: 成約日が欠落したデータを入力
    expect(() => {
      analyzeActionPatternAndGenerateReport({
        action_pattern_data: actionPatternData,
        closed_deals: closedDealsData,
        standard_process_steps: standardProcessSteps,
        analysis_period_start: "2024-01-01",
        analysis_period_end: "2024-01-31",
      });
    }).toThrow(/成約日/);
  });
});