import { generateActionPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-624
  test("チーム平均フォローアップ成功率が複数担当者から正確に計算される", () => {
    const mock_follow_up_data = [
      {
        sales_rep_id: "rep_A",
        sales_rep_name: "営業担当者A",
        follow_up_attempts: 10,
        follow_up_successes: 8,
      },
      {
        sales_rep_id: "rep_B",
        sales_rep_name: "営業担当者B",
        follow_up_attempts: 15,
        follow_up_successes: 12,
      },
      {
        sales_rep_id: "rep_C",
        sales_rep_name: "営業担当者C",
        follow_up_attempts: 20,
        follow_up_successes: 16,
      },
    ];

    const report = generateActionPatternAnalysisReport(mock_follow_up_data);

    const total_attempts = 10 + 15 + 20;
    const total_successes = 8 + 12 + 16;
    const expected_team_average_follow_up_success_rate =
      (total_successes / total_attempts) * 100;

    expect(report.team_average_follow_up_success_rate).toBe(80.0);
    expect(report.team_average_follow_up_success_rate).toBe(
      expected_team_average_follow_up_success_rate
    );
  });
});