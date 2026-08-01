import { describe, test, expect } from "@jest/globals";
import { generateBehaviorAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-625
  test("チーム平均との乖離度が正のパーセンテージで計算される（担当者成績 > チーム平均の場合）", () => {
    const sales_person_monthly_revenue = 1200000;
    const team_average_monthly_revenue = 1000000;

    const result = generateBehaviorAnalysisReport({
      sales_person_monthly_revenue,
      team_average_monthly_revenue,
    });

    const expected_deviation_percentage =
      ((sales_person_monthly_revenue - team_average_monthly_revenue) /
        team_average_monthly_revenue) *
      100;

    expect(result.deviation_percentage).toBe(20.0);
    expect(result.deviation_percentage).toBe(expected_deviation_percentage);
    expect(result.report_text).toContain("20.0%");
  });
});