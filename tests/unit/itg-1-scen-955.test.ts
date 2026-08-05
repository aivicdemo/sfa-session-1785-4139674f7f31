import { describe, test, expect, beforeEach } from "@jest/globals";
import {
  calculateImprovementPriorityScore,
  type ImprovementPriorityScoreInput,
  type ImprovementPriorityScoreResult,
} from "../../src/logic/it-1-br-2-1-1";

describe("営業担当者の改善優先度スコア算出機能", () => {
  // SCEN-955
  test("500件以上の改善対象問題パターンに対してスコア算出が完遂される", () => {
    const problem_patterns = [
      "提案資料不備",
      "フォローアップ遅延",
      "顧客ニーズ把握不足",
      "初回接触失敗",
      "提案内容不適切",
      "交渉中断",
      "成約逃し",
      "顧客満足度低下",
    ];

    const sales_staff_data: ImprovementPriorityScoreInput["sales_staff_with_problems"] =
      [];

    // 500件以上の改善対象問題パターンを複数営業担当者に割り当て
    let problem_count = 0;
    for (let staff_idx = 0; staff_idx < 65; staff_idx++) {
      const staff_problems = [];
      for (
        let pattern_idx = 0;
        pattern_idx < 8 && problem_count < 520;
        pattern_idx++
      ) {
        staff_problems.push({
          problem_id: `prob_${problem_count}`,
          pattern_name: problem_patterns[pattern_idx],
          occurrence_count: 2 + (pattern_idx % 5),
          impact_degree: 20 + ((staff_idx + pattern_idx) % 60),
          detection_date: "2024-01-15T10:00:00Z",
        });
        problem_count++;
      }
      sales_staff_data.push({
        staff_id: `staff_${staff_idx}`,
        staff_name: `営業担当者_${staff_idx}`,
        problems: staff_problems,
      });
    }

    const input: ImprovementPriorityScoreInput = {
      sales_staff_with_problems: sales_staff_data,
      evaluation_period_start: "2024-01-01",
      evaluation_period_end: "2024-01-31",
    };

    const start_time = Date.now();
    const result: ImprovementPriorityScoreResult = calculateImprovementPriorityScore(input);
    const elapsed_time_ms = Date.now() - start_time;

    // 処理実行時間が60秒以内であることを確認
    expect(elapsed_time_ms).toBeLessThan(60000);

    // 全営業担当者分のスコアが存在することを確認
    expect(result.scores).toBeDefined();
    expect(Array.isArray(result.scores)).toBe(true);
    expect(result.scores.length).toBe(sales_staff_data.length);

    // 各スコアが数値型で、0～100の範囲内にあることを検証
    result.scores.forEach((score_entry) => {
      expect(typeof score_entry.score).toBe("number");
      expect(score_entry.score).toBeGreaterThanOrEqual(0);
      expect(score_entry.score).toBeLessThanOrEqual(100);
      expect(typeof score_entry.staff_id).toBe("string");
      expect(score_entry.staff_id.length).toBeGreaterThan(0);
    });

    // 処理完了フラグと結果の整合性を確認
    expect(result.completion_status).toBe("completed");
    expect(result.total_problems_analyzed).toBe(problem_count);
    expect(result.error_message).toBeUndefined();
  });
});