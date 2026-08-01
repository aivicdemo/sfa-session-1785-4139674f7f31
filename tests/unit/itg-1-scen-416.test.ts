import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import { generateSalesRepBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  let mockDatabase: {
    sales_representatives: Array<{ id: string; name: string }>;
    behavior_pattern_analysis: Array<{
      sales_rep_id: string;
      analysis_date: string;
      visit_count: number;
      proposal_count: number;
      contract_count: number;
      visit_pattern: string;
      proposal_pattern: string;
      contract_pattern: string;
    }>;
  };

  beforeEach(() => {
    mockDatabase = {
      sales_representatives: [
        { id: "sr001", name: "営業太郎" },
        { id: "sr002", name: "営業花子" },
        { id: "sr003", name: "営業次郎" },
      ],
      behavior_pattern_analysis: [
        {
          sales_rep_id: "sr001",
          analysis_date: "2024-01-15",
          visit_count: 12,
          proposal_count: 8,
          contract_count: 3,
          visit_pattern: "weekday_afternoon",
          proposal_pattern: "email_followup",
          contract_pattern: "negotiation_based",
        },
        {
          sales_rep_id: "sr002",
          analysis_date: "2024-01-20",
          visit_count: 10,
          proposal_count: 7,
          contract_count: 2,
          visit_pattern: "weekday_morning",
          proposal_pattern: "phone_call",
          contract_pattern: "immediate",
        },
      ],
    };
  });

  afterEach(() => {
    mockDatabase = {
      sales_representatives: [],
      behavior_pattern_analysis: [],
    };
  });

  // SCEN-416
  test("営業担当者の分析データが存在しない場合、その営業担当者のレポートは生成されない", () => {
    const period_start = "2024-01-01";
    const period_end = "2024-01-31";

    const report = generateSalesRepBehaviorAnalysisReport(
      mockDatabase.sales_representatives,
      mockDatabase.behavior_pattern_analysis,
      period_start,
      period_end
    );

    expect(report.period_start).toBe("2024-01-01");
    expect(report.period_end).toBe("2024-01-31");
    expect(report.total_sales_reps_analyzed).toBe(2);
    expect(report.sales_reps_with_data).toEqual([
      {
        sales_rep_id: "sr001",
        name: "営業太郎",
        visit_count: 12,
        proposal_count: 8,
        contract_count: 3,
        visit_pattern: "weekday_afternoon",
        proposal_pattern: "email_followup",
        contract_pattern: "negotiation_based",
      },
      {
        sales_rep_id: "sr002",
        name: "営業花子",
        visit_count: 10,
        proposal_count: 7,
        contract_count: 2,
        visit_pattern: "weekday_morning",
        proposal_pattern: "phone_call",
        contract_pattern: "immediate",
      },
    ]);
    expect(report.sales_reps_without_data).toEqual([
      {
        sales_rep_id: "sr003",
        name: "営業次郎",
      },
    ]);
    expect(report.sales_reps_with_data).not.toContainEqual(
      expect.objectContaining({ sales_rep_id: "sr003" })
    );
    expect(
      report.sales_reps_with_data.some((rep) => rep.sales_rep_id === "sr003")
    ).toBe(false);
  });
});