import { generateBehaviorPatternAnalysisReport } from "../../src/logic/it-1-br-target4-1-1-1";

describe("行動パターン分析レポート生成機能", () => {
  // SCEN-317
  test("営業担当者ごとの行動パターンデータが1件の場合にレポートに含まれる", () => {
    const input = {
      salesperson_id: "SP_001",
      salesperson_name: "営業担当者A",
      behavior_patterns: [
        {
          visit_datetime: "2024-01-15",
          customer_name: "顧客X",
          activity_content: "提案",
          duration_minutes: 60,
        },
      ],
    };

    const result = generateBehaviorPatternAnalysisReport(input);

    expect(result.salesperson_name).toBe("営業担当者A");
    expect(result.total_behavior_count).toBe(1);
    expect(result.behavior_patterns).toHaveLength(1);
    expect(result.behavior_patterns[0]).toEqual({
      visit_datetime: "2024-01-15",
      customer_name: "顧客X",
      activity_content: "提案",
      duration_minutes: 60,
    });
  });
});