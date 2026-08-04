import { determinePriorityForImprovementGuidance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2899: [edge] 改善指導の優先度決定 - 改善対象件数が 1 件を超過するときに優先度が高と設定される
  test("改善対象件数が複数件（2件、3件、10件）のときは優先度が高に設定される", () => {
    const test_cases = [
      { improvement_target_count: 2, current_priority: "中" },
      { improvement_target_count: 3, current_priority: "中" },
      { improvement_target_count: 10, current_priority: "中" },
    ];

    test_cases.forEach((test_case) => {
      const result = determinePriorityForImprovementGuidance({
        improvement_target_count: test_case.improvement_target_count,
        current_priority: test_case.current_priority,
      });

      expect(result).toBe("高");
    });
  });
});