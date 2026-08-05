import { describe, test, expect } from "@jest/globals";
import { analyzeTeamSalesQualityStatistics } from "../../src/logic/it-1-br-2-1-1";

describe("Team Sales Quality Statistics Analysis - Follow-up Success Rate Validation", () => {
  test("SCEN-900: analyzeTeamSalesQualityStatistics throws error when follow-up success rate is NaN", () => {
    const salesRepData = [
      {
        sales_rep_id: "SR001",
        sales_rep_name: "Alice",
        proposal_success_rate: 0.75,
        followup_success_rate: NaN,
        contract_rate: 0.65,
        total_followups: 20,
        successful_followups: NaN,
      },
    ];

    const analysisParams = {
      target_period_start: new Date("2024-01-01T00:00:00Z"),
      target_period_end: new Date("2024-03-31T23:59:59Z"),
      team_sales_reps: salesRepData,
      minimum_data_points: 5,
    };

    expect(() => {
      analyzeTeamSalesQualityStatistics(analysisParams);
    }).toThrow(/Invalid follow-up success rate/);
  });
});