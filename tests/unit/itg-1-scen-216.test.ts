import { describe, it, expect, beforeEach } from "@jest/globals";
import { analyzeProcessDeviationPatterns } from "../../src/logic/it-1-br-2-1-1";

describe("プロセス乖離パターン分析機能", () => {
  it("SCEN-216: 営業担当者の行動が標準プロセスから単一方向で乖離している場合、乖離パターンが特定のパターンとして識別される", () => {
    // テストデータ: 標準プロセスの段階順序
    const standard_process_stages = ["stageA", "stageB", "stageC", "stageD"];

    // テストデータ: 営業担当者の実際の行動履歴（段階Bをスキップ）
    const actual_behavior_sequence = ["stageA", "stageC", "stageD"];

    // プロセス乖離パターン分析機能を実行
    const analysis_result = analyzeProcessDeviationPatterns(
      standard_process_stages,
      actual_behavior_sequence
    );

    // 期待結果の検証
    expect(analysis_result).toEqual({
      deviation_pattern: "segment_b_skip",
      deviation_type: "single_direction_skip",
      deviation_location: "segment:B",
      deviation_degree: 1,
      skipped_stages: ["stageB"],
      standard_sequence: ["stageA", "stageB", "stageC", "stageD"],
      actual_sequence: ["stageA", "stageC", "stageD"],
    });
  });
});