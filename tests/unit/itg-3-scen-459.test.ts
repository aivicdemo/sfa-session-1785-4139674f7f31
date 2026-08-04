import { calculatePrioritizationScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-459: [normal] 改善優先度スコアリング機能 - 影響度が閾値直下の場合、優先度スコアに正しく反映される
  test('should correctly apply weighting coefficient to prioritization score when impact score is just below threshold', () => {
    // 影響度の重み係数 40%
    const impact_weight = 0.40;
    const impact_score_just_below_threshold = 0.49;
    const impact_score_at_threshold = 0.50;

    // テスト用の商談条件データを準備
    const deal_conditions = {
      industry: '小売',
      contract_size_million_yen: 5.0,
      decision_maker_count: 3,
      impact_score: impact_score_just_below_threshold
    };

    // 優先度スコアリング機能を実行
    const priority_score_below = calculatePrioritizationScore({
      impact_score: impact_score_just_below_threshold,
      urgency_score: 0.5,
      feasibility_score: 0.5
    });

    // 閾値時点でのスコアも計算
    const priority_score_at_threshold = calculatePrioritizationScore({
      impact_score: impact_score_at_threshold,
      urgency_score: 0.5,
      feasibility_score: 0.5
    });

    // 影響度 0.49 と 0.50 のスコア差分を検証
    // 期待値: 影響度の重み係数が 40% の場合、0.01 の影響度差分 × 0.40 = 0.004 の差分
    const expected_score_difference = 0.01 * impact_weight;
    const actual_score_difference = priority_score_at_threshold - priority_score_below;

    // 差分が期待値の範囲内（線形性の確認）
    expect(actual_score_difference).toBeCloseTo(expected_score_difference, 4);

    // 優先度スコアが 0 から 100 の範囲内かつ単調性を確保
    expect(priority_score_below).toBeGreaterThanOrEqual(0);
    expect(priority_score_below).toBeLessThanOrEqual(100);
    expect(priority_score_at_threshold).toBeGreaterThan(priority_score_below);

    // 具体的な優先度スコア値の検証
    // 仮設計値: 基本スコア 50 + (影響度 0.49 × 40 × 100) = 50 + 19.6 = 69.6
    const expected_priority_score_below = 50 + (impact_score_just_below_threshold * impact_weight * 100);
    expect(priority_score_below).toBeCloseTo(expected_priority_score_below, 1);

    // 影響度スコアが線形かつ単調に計算されていることを複数ポイントで検証
    const priority_score_0_48 = calculatePrioritizationScore({
      impact_score: 0.48,
      urgency_score: 0.5,
      feasibility_score: 0.5
    });
    const priority_score_0_51 = calculatePrioritizationScore({
      impact_score: 0.51,
      urgency_score: 0.5,
      feasibility_score: 0.5
    });

    expect(priority_score_0_48).toBeLessThan(priority_score_below);
    expect(priority_score_below).toBeLessThan(priority_score_at_threshold);
    expect(priority_score_at_threshold).toBeLessThan(priority_score_0_51);

    // スコア差分の一貫性を検証（単調性）
    const diff_048_049 = priority_score_below - priority_score_0_48;
    const diff_049_050 = priority_score_at_threshold - priority_score_below;
    const diff_050_051 = priority_score_0_51 - priority_score_at_threshold;

    expect(diff_048_049).toBeCloseTo(diff_049_050, 2);
    expect(diff_049_050).toBeCloseTo(diff_050_051, 2);
  });
});