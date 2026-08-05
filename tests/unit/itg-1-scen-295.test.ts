import { calculateBehaviorPatternDeviation, judgeCoachingPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-295
  test("should judge sales rep as non-coaching-target when deviation is at upper tolerance boundary (9.99%)", () => {
    // 標準プロセス定義を設定
    const standard_process = {
      initial_contact_frequency: 2,
      proposal_success_rate: 0.8,
      followup_interval_days: 3,
    };

    // 営業担当者Aの実績行動データ
    const actual_behavior = {
      initial_contact_frequency: 2.0,
      proposal_success_rate: 0.721,
      followup_interval_days: 3.297,
    };

    // 行動パターン分析結果として乖離度を計算
    const deviation_percentage = calculateBehaviorPatternDeviation(
      standard_process,
      actual_behavior
    );

    // 期待値: +9.99%（許容上限10.00%の直下）
    expect(deviation_percentage).toBe(9.99);

    // 改善指導優先順位判定ロジックに乖離度を入力
    const coaching_tolerance_upper_limit = 10.0;
    const judgment_result = judgeCoachingPriority({
      deviation_percentage,
      tolerance_upper_limit: coaching_tolerance_upper_limit,
    });

    // 期待結果: 改善指導対象外と判定
    expect(judgment_result.is_coaching_target).toBe(false);
    expect(judgment_result.coaching_status).toBe("non-target");
    expect(judgment_result.judgment_reason).toMatch(/乖離度が許容範囲内/);
    expect(judgment_result.judgment_reason).toMatch(/9\.99%/);
    expect(judgment_result.judgment_reason).toMatch(/10\.00%/);
  });
});