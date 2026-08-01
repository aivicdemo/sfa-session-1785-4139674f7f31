import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  analyzeProcessDeviationAndCorrelation,
} from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者ごとの行動パターン分析レポート生成機能", () => {
  // SCEN-840
  test("行動パターンデータが0件の場合、分析不可エラーを発生させる", () => {
    const trigger_event_id = "EVT-2024-01-15-001";
    const triggered_at = new Date("2024-01-15T09:00:00Z");
    const target_sales_reps = ["SR001", "SR002", "SR003"];
    const analysis_period_start = new Date("2024-01-01T00:00:00Z");
    const analysis_period_end = new Date("2024-01-31T23:59:59Z");
    const behavior_pattern_data = [];
    const contract_results = [
      {
        contract_result_id: "CTR001",
        sales_rep_id: "SR001",
        deal_id: "DEAL001",
        contract_date: new Date("2024-01-20T00:00:00Z"),
        contract_amount: 500000,
      },
    ];
    const process_definition = {
      process_def_id: "PROC001",
      stages: [
        { stage_id: "S1", stage_name: "初回接触" },
        { stage_id: "S2", stage_name: "提案" },
        { stage_id: "S3", stage_name: "交渉" },
        { stage_id: "S4", stage_name: "成約" },
      ],
    };

    expect(() => {
      analyzeProcessDeviationAndCorrelation({
        trigger_event_id,
        triggered_at,
        target_sales_reps,
        analysis_period_start,
        analysis_period_end,
        behavior_pattern_data,
        contract_results,
        process_definition,
      });
    }).toThrow(/行動パターンデータ/);
  });
});