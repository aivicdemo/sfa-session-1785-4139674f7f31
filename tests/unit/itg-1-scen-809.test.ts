import { describe, test, expect } from "@jest/globals";
import { analyzeActionPattern } from "../../src/logic/it-1-br-target4-1-1-1";

describe("営業担当者行動パターン分析レポート生成機能", () => {
  // SCEN-809
  test("営業プロセスのステップ数が複数の場合、全ステップの乖離度を個別に計算して集計する", () => {
    const process_template = {
      process_id: "proc_001",
      process_name: "標準営業プロセス",
      steps: [
        {
          step_id: "step_001",
          step_name: "初期接触",
          standard_days: 5,
        },
        {
          step_id: "step_002",
          step_name: "提案",
          standard_days: 10,
        },
        {
          step_id: "step_003",
          step_name: "クロージング",
          standard_days: 15,
        },
      ],
    };

    const salesperson_activity = {
      salesperson_id: "sales_A",
      salesperson_name: "営業担当者A",
      activity_records: [
        {
          step_id: "step_001",
          step_name: "初期接触",
          actual_days: 7,
        },
        {
          step_id: "step_002",
          step_name: "提案",
          actual_days: 14,
        },
        {
          step_id: "step_003",
          step_name: "クロージング",
          actual_days: 21,
        },
      ],
    };

    const result = analyzeActionPattern(process_template, salesperson_activity);

    expect(result.step_deviations).toEqual([
      {
        step_id: "step_001",
        step_name: "初期接触",
        standard_days: 5,
        actual_days: 7,
        deviation_days: 2,
      },
      {
        step_id: "step_002",
        step_name: "提案",
        standard_days: 10,
        actual_days: 14,
        deviation_days: 4,
      },
      {
        step_id: "step_003",
        step_name: "クロージング",
        standard_days: 15,
        actual_days: 21,
        deviation_days: 6,
      },
    ]);

    expect(result.total_deviation_days).toBe(12);
    expect(result.salesperson_id).toBe("sales_A");
  });
});