import { calculateDeviationScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-301: [edge] 行動パターン分析と改善指導優先順位判定機能 - 年度をまたぐ期間の営業活動データが集計対象に含まれる場合、乖離度の計算に正確に反映される
  test('年度をまたぐ期間のデータが乖離度計算に正確に反映される', () => {
    // 2023年度（2023/4/1～2024/3/31）のデータ10件のうち、2024年1月1日以降のデータ4件
    const fy2023_activity = [
      {
        activity_id: 'act_2023_001',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-01-15T10:00:00Z'),
        activity_type: '訪問',
        result_type: '商談成立',
        proposal_amount: 500000,
      },
      {
        activity_id: 'act_2023_002',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-02-20T11:30:00Z'),
        activity_type: '電話',
        result_type: '商談成立',
        proposal_amount: 300000,
      },
      {
        activity_id: 'act_2023_003',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-03-10T09:00:00Z'),
        activity_type: '訪問',
        result_type: '提案実施',
        proposal_amount: 200000,
      },
      {
        activity_id: 'act_2023_004',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-03-25T14:00:00Z'),
        activity_type: 'メール',
        result_type: '提案実施',
        proposal_amount: 150000,
      },
      // 集計期間外（2023/12/31以前）のデータ6件は除外される
      {
        activity_id: 'act_2023_005',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2023-12-20T10:00:00Z'),
        activity_type: '訪問',
        result_type: '初回接触',
        proposal_amount: 100000,
      },
      {
        activity_id: 'act_2023_006',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2023-11-15T11:00:00Z'),
        activity_type: '電話',
        result_type: '初回接触',
        proposal_amount: 80000,
      },
      {
        activity_id: 'act_2023_007',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2023-10-10T09:00:00Z'),
        activity_type: '訪問',
        result_type: '初回接触',
        proposal_amount: 120000,
      },
      {
        activity_id: 'act_2023_008',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2023-09-05T14:00:00Z'),
        activity_type: 'メール',
        result_type: '初回接触',
        proposal_amount: 90000,
      },
      {
        activity_id: 'act_2023_009',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2023-08-18T10:30:00Z'),
        activity_type: '訪問',
        result_type: '初回接触',
        proposal_amount: 110000,
      },
      {
        activity_id: 'act_2023_010',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2023-07-22T15:00:00Z'),
        activity_type: '電話',
        result_type: '初回接触',
        proposal_amount: 70000,
      },
    ];

    // 2024年度（2024/4/1～2025/3/31）のデータ15件のうち、2024年12月31日までのデータ12件
    const fy2024_activity = [
      {
        activity_id: 'act_2024_001',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-04-10T10:00:00Z'),
        activity_type: '訪問',
        result_type: '商談成立',
        proposal_amount: 600000,
      },
      {
        activity_id: 'act_2024_002',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-05-15T11:00:00Z'),
        activity_type: '電話',
        result_type: '商談成立',
        proposal_amount: 400000,
      },
      {
        activity_id: 'act_2024_003',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-06-20T09:30:00Z'),
        activity_type: '訪問',
        result_type: '商談成立',
        proposal_amount: 550000,
      },
      {
        activity_id: 'act_2024_004',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-07-12T14:00:00Z'),
        activity_type: 'メール',
        result_type: '提案実施',
        proposal_amount: 250000,
      },
      {
        activity_id: 'act_2024_005',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-08-08T10:15:00Z'),
        activity_type: '訪問',
        result_type: '提案実施',
        proposal_amount: 320000,
      },
      {
        activity_id: 'act_2024_006',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-09-14T11:45:00Z'),
        activity_type: '電話',
        result_type: '提案実施',
        proposal_amount: 280000,
      },
      {
        activity_id: 'act_2024_007',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-10-05T09:00:00Z'),
        activity_type: '訪問',
        result_type: '商談成立',
        proposal_amount: 470000,
      },
      {
        activity_id: 'act_2024_008',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-11-10T13:30:00Z'),
        activity_type: 'メール',
        result_type: '商談成立',
        proposal_amount: 380000,
      },
      {
        activity_id: 'act_2024_009',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-11-22T10:00:00Z'),
        activity_type: '訪問',
        result_type: '提案実施',
        proposal_amount: 310000,
      },
      {
        activity_id: 'act_2024_010',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-12-01T11:00:00Z'),
        activity_type: '電話',
        result_type: '商談成立',
        proposal_amount: 420000,
      },
      {
        activity_id: 'act_2024_011',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-12-15T14:00:00Z'),
        activity_type: '訪問',
        result_type: '商談成立',
        proposal_amount: 360000,
      },
      {
        activity_id: 'act_2024_012',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2024-12-28T10:30:00Z'),
        activity_type: 'メール',
        result_type: '提案実施',
        proposal_amount: 290000,
      },
      // 集計期間外（2025年1月以降）のデータ3件は除外される
      {
        activity_id: 'act_2024_013',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2025-01-10T10:00:00Z'),
        activity_type: '訪問',
        result_type: '提案実施',
        proposal_amount: 200000,
      },
      {
        activity_id: 'act_2024_014',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2025-02-15T11:00:00Z'),
        activity_type: '電話',
        result_type: '初回接触',
        proposal_amount: 150000,
      },
      {
        activity_id: 'act_2024_015',
        sales_rep_id: 'rep_001',
        activity_date: new Date('2025-03-20T09:00:00Z'),
        activity_type: '訪問',
        result_type: '初回接触',
        proposal_amount: 180000,
      },
    ];

    const all_activities = [...fy2023_activity, ...fy2024_activity];

    // 標準プロセス定義
    const process_definition = {
      process_id: 'proc_001',
      stage_definitions: [
        { stage_id: 'stage_1', stage_name: '初回接触', weight: 0.1 },
        { stage_id: 'stage_2', stage_name: '提案実施', weight: 0.3 },
        { stage_id: 'stage_3', stage_name: '商談成立', weight: 0.6 },
      ],
      target_completion_rate: 0.75,
    };

    // 営業担当者の目標達成率
    const target_achievement_rate = 0.8;

    // 集計期間指定：2024年1月1日～2024年12月31日
    const aggregation_start_date = new Date('2024-01-01T00:00:00Z');
    const aggregation_end_date = new Date('2024-12-31T23:59:59Z');

    // 期待される集計対象データ数
    // - 2023年度から4件（2024/1/1～3/31）
    // - 2024年度から12件（2024/4/1～12/31）
    // - 合計16件
    const expected_aggregated_count = 16;

    // 集計対象に含まれるデータの合計提案金額
    const expected_aggregated_proposal_amount =
      500000 + // act_2023_001
      300000 + // act_2023_002
      200000 + // act_2023_003
      150000 + // act_2023_004
      600000 + // act_2024_001
      400000 + // act_2024_002
      550000 + // act_2024_003
      250000 + // act_2024_004
      320000 + // act_2024_005
      280000 + // act_2024_006
      470000 + // act_2024_007
      380000 + // act_2024_008
      310000 + // act_2024_009
      420000 + // act_2024_010
      360000 + // act_2024_011
      290000; // act_2024_012

    // 実績達成率の計算（商談成立件数 / 全件数）
    // 商談成立：act_2023_001, act_2023_002, act_2024_001, act_2024_002, act_2024_003, act_2024_007, act_2024_008, act_2024_010, act_2024_011 = 9件
    // 全件数：16件
    // 実績達成率 = 9 / 16 = 0.5625
    const actual_achievement_rate = 9 / 16; // 0.5625

    // 乖離度の計算式
    // 乖離度 = 目標達成率 - 実績達成率
    // = 0.8 - 0.5625 = 0.2375
    const expected_deviation_score = target_achievement_rate - actual_achievement_rate;

    const result = calculateDeviationScore({
      activities: all_activities,
      process_definition: process_definition,
      sales_rep_id: 'rep_001',
      target_achievement_rate: target_achievement_rate,
      aggregation_start_date: aggregation_start_date,
      aggregation_end_date: aggregation_end_date,
    });

    // 年度をまたぐデータが正確に集計されたことを確認
    expect(result.aggregated_activities_count).toBe(expected_aggregated_count);
    expect(result.aggregated_proposal_amount).toBe(
      expected_aggregated_proposal_amount
    );

    // 乖離度が期待値と一致することを確認
    // 許容誤差は浮動小数点演算の誤差を考慮して0.0001
    expect(Math.abs(result.deviation_score - expected_deviation_score)).toBeLessThan(0.0001);
    expect(result.actual_achievement_rate).toBeCloseTo(actual_achievement_rate, 4);
    expect(result.target_achievement_rate).toBe(target_achievement_rate);
  });
});