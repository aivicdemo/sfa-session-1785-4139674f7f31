import { analyzeAndJudgeImprovementGuidance } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-275: [error] 営業担当者行動パターン分析・改善指導判定機能 - 商談進捗データが空配列のとき、処理が中断される
  test("should return EMPTY_NEGOTIATION_DATA error when negotiation_progress_data is empty array", () => {
    const input_params = {
      negotiation_progress_data: [],
      sales_staff_master_data: [
        {
          sales_staff_id: "SS001",
          sales_staff_name: "営業担当者A",
          department_id: "DEPT01"
        }
      ],
      sales_process_definition: {
        process_id: "PROC001",
        stage_sequence: ["initial_contact", "proposal", "negotiation", "contract"],
        kpi_criteria: {
          initial_contact_target: 10,
          proposal_target: 5,
          negotiation_target: 2
        }
      },
      contract_results: [
        {
          contract_id: "CTR001",
          sales_staff_id: "SS001",
          contract_amount: 1000000,
          contract_date: "2024-01-15",
          success_flag: true
        }
      ],
      deviation_threshold_percentage: 20,
      improvement_guidance_flag: false
    };

    const result = analyzeAndJudgeImprovementGuidance(input_params);

    expect(result).toEqual({
      error_code: "EMPTY_NEGOTIATION_DATA",
      error_message: expect.stringContaining("商談進捗データ"),
      analysis_result: null,
      improvement_guidance_flag: false,
      database_write_executed: false
    });
    expect(result.error_code).toBe("EMPTY_NEGOTIATION_DATA");
    expect(result.database_write_executed).toBe(false);
    expect(result.improvement_guidance_flag).toBe(false);
  });
});