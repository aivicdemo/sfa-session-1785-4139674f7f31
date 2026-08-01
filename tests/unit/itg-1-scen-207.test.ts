import { calculateSalesPersonBehaviorAnalysis } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-207
  test("営業担当者行動パターン分析・改善指導対象判定機能 - 営業担当者の行動状態が標準プロセス完了である場合、完了データが集計される", () => {
    const sales_person_id = "SP-001";
    const completed_at = "2024-01-15T15:30:00Z";
    const process_stage_1_completed = true;
    const process_stage_2_completed = true;
    const process_stage_3_completed = true;
    const process_stage_4_completed = true;
    const process_stage_5_completed = true;
    const behavior_status = "STANDARD_PROCESS_COMPLETED";

    const input = {
      sales_person_id: sales_person_id,
      completed_at: completed_at,
      process_stage_1_completed: process_stage_1_completed,
      process_stage_2_completed: process_stage_2_completed,
      process_stage_3_completed: process_stage_3_completed,
      process_stage_4_completed: process_stage_4_completed,
      process_stage_5_completed: process_stage_5_completed,
      behavior_status: behavior_status,
    };

    const result = calculateSalesPersonBehaviorAnalysis(input);

    expect(result.is_included_in_aggregation).toBe(true);
    expect(result.aggregated_completion_count).toBe(1);
    expect(result.sales_person_id).toBe(sales_person_id);
    expect(result.completed_at).toBe(completed_at);
    expect(result.all_process_stages_completed).toBe(true);
  });
});