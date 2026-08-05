import {
  decidePriorityForImprovementGuidance,
} from "../../src/logic/it-1-br-2-1-1";

describe("改善指導優先順位決定機能", () => {
  test("SCEN-219: 同一遵守度スコアの場合、乖離パターンの重大度に基づいて優先順位が判定される", () => {
    // Setup: 営業担当者Aと営業担当者Bの遵守度スコアを同一値（75点）に設定
    const salesperson_a_compliance_score = 75;
    const salesperson_b_compliance_score = 75;

    // 営業担当者Aに『顧客情報の不正アクセス試行』（重大度：Critical）の乖離パターンを1件割り当て
    const salesperson_a_deviations = [
      {
        deviation_pattern_id: "dev_001",
        deviation_type: "customer_info_unauthorized_access",
        severity_level: "Critical",
        occurrence_count: 1,
      },
    ];

    // 営業担当者Bに『報告書提出遅延』（重大度：Low）の乖離パターンを2件割り当て
    const salesperson_b_deviations = [
      {
        deviation_pattern_id: "dev_002",
        deviation_type: "report_submission_delay",
        severity_level: "Low",
        occurrence_count: 2,
      },
    ];

    // 営業担当者Aの改善指導優先順位を決定
    const salesperson_a_priority = decidePriorityForImprovementGuidance({
      salesperson_id: "sp_001",
      compliance_score: salesperson_a_compliance_score,
      deviations: salesperson_a_deviations,
    });

    // 営業担当者Bの改善指導優先順位を決定
    const salesperson_b_priority = decidePriorityForImprovementGuidance({
      salesperson_id: "sp_002",
      compliance_score: salesperson_b_compliance_score,
      deviations: salesperson_b_deviations,
    });

    // 同一遵守度スコア（75点）でも、重大度がCriticalの乖離パターンを持つ営業担当者Aが、
    // 重大度がLowの乖離パターンを複数件持つ営業担当者Bよりも優先度が高いことを検証
    // 期待値：営業担当者Aの優先順位が営業担当者Bより高い（数値が小さい）
    expect(salesperson_a_priority.priority_rank).toBe(1);
    expect(salesperson_b_priority.priority_rank).toBe(2);
    expect(salesperson_a_priority.priority_rank).toBeLessThan(
      salesperson_b_priority.priority_rank
    );

    // 優先順位決定の根拠が重大度に基づいていることを確認
    expect(salesperson_a_priority.priority_reason).toContain("Critical");
    expect(salesperson_b_priority.priority_reason).toContain("Low");
  });
});