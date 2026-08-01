import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-336
  test("同じ入力データで2回分析を実行した場合、同じ結果が得られる", () => {
    const sales_representative_id = "SA001";
    const visit_count = 150;
    const deal_closure_rate = 35;
    const average_deal_duration_minutes = 45;

    const analysis_input = {
      sales_representative_id,
      visit_count,
      deal_closure_rate,
      average_deal_duration_minutes,
    };

    const first_analysis_result = generateBehaviorPatternAnalysisReport(
      analysis_input
    );

    const second_analysis_result = generateBehaviorPatternAnalysisReport(
      analysis_input
    );

    expect(first_analysis_result.pattern_id).toBe(
      second_analysis_result.pattern_id
    );
    expect(first_analysis_result.clustering_result).toBe(
      second_analysis_result.clustering_result
    );
    expect(first_analysis_result.behavior_score).toBe(
      second_analysis_result.behavior_score
    );
    expect(Math.round(first_analysis_result.behavior_score * 100) / 100).toBe(
      Math.round(second_analysis_result.behavior_score * 100) / 100
    );
  });
});