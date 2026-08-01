import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-344
  test("行動パターンスコアが降順で正しくソートされる", () => {
    const mockSalesReps = [
      {
        sales_rep_id: "A",
        sales_rep_name: "営業担当者A",
        behavior_pattern_score: 75,
      },
      {
        sales_rep_id: "B",
        sales_rep_name: "営業担当者B",
        behavior_pattern_score: 92,
      },
      {
        sales_rep_id: "C",
        sales_rep_name: "営業担当者C",
        behavior_pattern_score: 58,
      },
    ];

    const report = generateBehaviorPatternAnalysisReport(mockSalesReps);

    expect(report.sales_reps).toHaveLength(3);
    expect(report.sales_reps[0]).toEqual({
      sales_rep_id: "B",
      sales_rep_name: "営業担当者B",
      behavior_pattern_score: 92,
    });
    expect(report.sales_reps[1]).toEqual({
      sales_rep_id: "A",
      sales_rep_name: "営業担当者A",
      behavior_pattern_score: 75,
    });
    expect(report.sales_reps[2]).toEqual({
      sales_rep_id: "C",
      sales_rep_name: "営業担当者C",
      behavior_pattern_score: 58,
    });
  });
});