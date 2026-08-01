import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-645
  test("同じ入力データで2回計算した場合、全く同じ結果が返される", () => {
    const sales_representative_id = "tanaka_taro_001";
    const analysis_start_date = new Date("2024-09-16T00:00:00Z");
    const analysis_end_date = new Date("2024-12-14T23:59:59Z");
    const target_metrics = [
      "visit_frequency",
      "proposal_count",
      "contract_count",
      "average_meeting_duration",
    ];

    const test_data = {
      sales_representative_id: sales_representative_id,
      sales_representative_name: "田中太郎",
      visit_count: 42,
      proposal_count: 18,
      contract_count: 5,
      average_meeting_duration_minutes: 47,
    };

    const result1 = generateBehaviorPatternAnalysisReport({
      sales_representative_id: sales_representative_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      target_metrics: target_metrics,
      behavioral_data: test_data,
    });

    const result2 = generateBehaviorPatternAnalysisReport({
      sales_representative_id: sales_representative_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      target_metrics: target_metrics,
      behavioral_data: test_data,
    });

    expect(result1.visit_frequency_pattern).toBe("中程度集中型");
    expect(result2.visit_frequency_pattern).toBe("中程度集中型");

    expect(result1.proposal_success_rate).toBe(27.8);
    expect(result2.proposal_success_rate).toBe(27.8);

    expect(result1.average_meeting_duration_minutes).toBe(47);
    expect(result2.average_meeting_duration_minutes).toBe(47);

    expect(result1.behavior_score).toBe(72);
    expect(result2.behavior_score).toBe(72);

    expect(result1.recommended_action).toBe("顧客フォローアップ強化");
    expect(result2.recommended_action).toBe("顧客フォローアップ強化");

    expect(result1).toEqual({
      ...result2,
      report_id: result1.report_id,
    });
  });
});