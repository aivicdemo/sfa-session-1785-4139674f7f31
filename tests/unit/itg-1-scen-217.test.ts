import { analyzeProcessDeviationPatterns } from "../../src/logic/it-1-br-2-1-1";

describe("営業プロセス乖離パターン分析", () => {
  // SCEN-217
  test("複合乖離パターンが識別される", () => {
    const standard_process = [
      { step_number: 1, step_name: "初回接触", sequence_order: 1 },
      { step_number: 2, step_name: "提案", sequence_order: 2 },
      { step_number: 3, step_name: "見積提示", sequence_order: 3 },
      { step_number: 4, step_name: "契約", sequence_order: 4 },
    ];

    const actual_actions = [
      {
        action_id: 1,
        action_type: "見積提示",
        executed_order: 1,
        timestamp: "2024-01-15T10:00:00Z",
      },
      {
        action_id: 2,
        action_type: "提案",
        executed_order: 2,
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        action_id: 3,
        action_type: "提案",
        executed_order: 3,
        timestamp: "2024-01-15T11:00:00Z",
      },
      {
        action_id: 4,
        action_type: "契約",
        executed_order: 4,
        timestamp: "2024-01-15T11:30:00Z",
      },
    ];

    const result = analyzeProcessDeviationPatterns({
      salesperson_id: "SP001",
      standard_process: standard_process,
      actual_actions: actual_actions,
    });

    expect(result).toHaveProperty("salesperson_id", "SP001");
    expect(result).toHaveProperty("deviation_patterns");
    expect(Array.isArray(result.deviation_patterns)).toBe(true);
    expect(result.deviation_patterns.length).toBe(3);

    const deviation_type_map = result.deviation_patterns.reduce(
      (acc: Record<string, unknown>, pattern: { type: string }) => {
        acc[pattern.type] = pattern;
        return acc;
      },
      {}
    );

    expect(deviation_type_map).toHaveProperty("ステップスキップ");
    const skip_pattern = deviation_type_map["ステップスキップ"] as {
      type: string;
      skipped_step: string;
      expected_sequence_order: number;
    };
    expect(skip_pattern.skipped_step).toBe("初回接触");
    expect(skip_pattern.expected_sequence_order).toBe(1);

    expect(deviation_type_map).toHaveProperty("ステップ順序逆転");
    const order_pattern = deviation_type_map["ステップ順序逆転"] as {
      type: string;
      earlier_step: string;
      later_step: string;
      earlier_expected_order: number;
      later_expected_order: number;
    };
    expect(order_pattern.earlier_step).toBe("見積提示");
    expect(order_pattern.later_step).toBe("提案");
    expect(order_pattern.earlier_expected_order).toBe(3);
    expect(order_pattern.later_expected_order).toBe(2);

    expect(deviation_type_map).toHaveProperty("ステップ重複");
    const duplicate_pattern = deviation_type_map["ステップ重複"] as {
      type: string;
      duplicated_step: string;
      occurrence_count: number;
    };
    expect(duplicate_pattern.duplicated_step).toBe("提案");
    expect(duplicate_pattern.occurrence_count).toBe(2);

    expect(result).toHaveProperty("analysis_timestamp");
    expect(typeof result.analysis_timestamp).toBe("string");

    expect(result).toHaveProperty("composite_deviation_score");
    expect(typeof result.composite_deviation_score).toBe("number");
    expect(result.composite_deviation_score).toBeGreaterThan(0);
    expect(result.composite_deviation_score).toBeLessThanOrEqual(100);
  });
});