import { describe, test, expect } from '@jest/globals';
import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-622
  test('乖離度数値化計算に必要なパラメータが欠落しているときエラーになる', () => {
    const valid_sales_rep_id = 'SR001';
    const valid_analysis_period_start = '2024-01-01';
    const valid_analysis_period_end = '2024-01-31';
    const valid_deal_performance_dataset = [
      {
        deal_id: 'D001',
        result_status: 'won',
        contract_amount: 500000,
        closed_date: '2024-01-20'
      }
    ];
    const valid_behavior_pattern_dataset = [
      {
        sales_rep_id: 'SR001',
        contact_count: 5,
        proposal_count: 2,
        followup_interval_days: 3
      }
    ];

    // Test: 営業担当者IDがnullの場合
    expect(() =>
      calculateDeviationScore(
        null,
        valid_analysis_period_start,
        valid_analysis_period_end,
        valid_deal_performance_dataset,
        valid_behavior_pattern_dataset
      )
    ).toThrow(/営業担当者ID/);

    // Test: 営業担当者IDがundefinedの場合
    expect(() =>
      calculateDeviationScore(
        undefined,
        valid_analysis_period_start,
        valid_analysis_period_end,
        valid_deal_performance_dataset,
        valid_behavior_pattern_dataset
      )
    ).toThrow(/営業担当者ID/);

    // Test: 分析対象期間開始日がnullの場合
    expect(() =>
      calculateDeviationScore(
        valid_sales_rep_id,
        null,
        valid_analysis_period_end,
        valid_deal_performance_dataset,
        valid_behavior_pattern_dataset
      )
    ).toThrow(/分析対象期間/);

    // Test: 分析対象期間終了日がundefinedの場合
    expect(() =>
      calculateDeviationScore(
        valid_sales_rep_id,
        valid_analysis_period_start,
        undefined,
        valid_deal_performance_dataset,
        valid_behavior_pattern_dataset
      )
    ).toThrow(/分析対象期間/);

    // Test: 成約実績データセットがnullの場合
    expect(() =>
      calculateDeviationScore(
        valid_sales_rep_id,
        valid_analysis_period_start,
        valid_analysis_period_end,
        null,
        valid_behavior_pattern_dataset
      )
    ).toThrow(/成約実績/);

    // Test: 成約実績データセットがundefinedの場合
    expect(() =>
      calculateDeviationScore(
        valid_sales_rep_id,
        valid_analysis_period_start,
        valid_analysis_period_end,
        undefined,
        valid_behavior_pattern_dataset
      )
    ).toThrow(/成約実績/);

    // Test: 行動パターンデータセットがnullの場合
    expect(() =>
      calculateDeviationScore(
        valid_sales_rep_id,
        valid_analysis_period_start,
        valid_analysis_period_end,
        valid_deal_performance_dataset,
        null
      )
    ).toThrow(/行動パターン/);

    // Test: 行動パターンデータセットがundefinedの場合
    expect(() =>
      calculateDeviationScore(
        valid_sales_rep_id,
        valid_analysis_period_start,
        valid_analysis_period_end,
        valid_deal_performance_dataset,
        undefined
      )
    ).toThrow(/行動パターン/);
  });
});