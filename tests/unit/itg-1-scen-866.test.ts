import { calculateTeamAverageDeviation } from "../../src/logic/it-1-br-2-1-1";

describe("チーム平均との乖離度判定機能", () => {
  // SCEN-866
  test("フォローアップ成功率のチーム平均値が正常に算出される", () => {
    const sales_rep_a = {
      sales_rep_id: "REP_A",
      sales_rep_name: "営業担当者A",
      branch: "東京支店",
      followup_success_rate: 80.0,
    };

    const sales_rep_b = {
      sales_rep_id: "REP_B",
      sales_rep_name: "営業担当者B",
      branch: "東京支店",
      followup_success_rate: 70.0,
    };

    const sales_rep_c = {
      sales_rep_id: "REP_C",
      sales_rep_name: "営業担当者C",
      branch: "東京支店",
      followup_success_rate: 60.0,
    };

    const team_members = [sales_rep_a, sales_rep_b, sales_rep_c];
    const target_branch = "東京支店";

    const result = calculateTeamAverageDeviation({
      team_members,
      target_branch,
    });

    expect(result.team_average_followup_success_rate).toBe(70.0);
  });
});