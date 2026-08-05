import { generateSalesRepBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-604
  test('複数の営業担当者ごとに個別の行動パターン分析レポートが生成される', () => {
    // テストデータ: 営業担当者A、B、Cの3名分の行動履歴
    const sales_rep_a_id = 'rep_001';
    const sales_rep_b_id = 'rep_002';
    const sales_rep_c_id = 'rep_003';

    const analysis_start_date = '2024-01-01';
    const analysis_end_date = '2024-01-31';

    // 営業担当者A の行動データ
    const rep_a_activities = [
      {
        sales_rep_id: sales_rep_a_id,
        activity_type: 'visit',
        activity_date: '2024-01-05T09:30:00Z',
        day_of_week: 'Friday',
        hour_of_day: 9,
      },
      {
        sales_rep_id: sales_rep_a_id,
        activity_type: 'visit',
        activity_date: '2024-01-12T10:00:00Z',
        day_of_week: 'Friday',
        hour_of_day: 10,
      },
      {
        sales_rep_id: sales_rep_a_id,
        activity_type: 'proposal',
        activity_date: '2024-01-08T14:00:00Z',
      },
      {
        sales_rep_id: sales_rep_a_id,
        activity_type: 'contract',
        activity_date: '2024-01-18T11:00:00Z',
      },
      {
        sales_rep_id: sales_rep_a_id,
        activity_type: 'visit',
        activity_date: '2024-01-19T09:15:00Z',
        day_of_week: 'Friday',
        hour_of_day: 9,
      },
    ];

    // 営業担当者B の行動データ
    const rep_b_activities = [
      {
        sales_rep_id: sales_rep_b_id,
        activity_type: 'visit',
        activity_date: '2024-01-03T13:00:00Z',
        day_of_week: 'Wednesday',
        hour_of_day: 13,
      },
      {
        sales_rep_id: sales_rep_b_id,
        activity_type: 'visit',
        activity_date: '2024-01-10T14:30:00Z',
        day_of_week: 'Wednesday',
        hour_of_day: 14,
      },
      {
        sales_rep_id: sales_rep_b_id,
        activity_type: 'proposal',
        activity_date: '2024-01-06T10:00:00Z',
      },
      {
        sales_rep_id: sales_rep_b_id,
        activity_type: 'contract',
        activity_date: '2024-01-15T15:00:00Z',
      },
      {
        sales_rep_id: sales_rep_b_id,
        activity_type: 'visit',
        activity_date: '2024-01-24T13:45:00Z',
        day_of_week: 'Wednesday',
        hour_of_day: 13,
      },
    ];

    // 営業担当者C の行動データ
    const rep_c_activities = [
      {
        sales_rep_id: sales_rep_c_id,
        activity_type: 'visit',
        activity_date: '2024-01-02T08:00:00Z',
        day_of_week: 'Tuesday',
        hour_of_day: 8,
      },
      {
        sales_rep_id: sales_rep_c_id,
        activity_type: 'visit',
        activity_date: '2024-01-09T08:30:00Z',
        day_of_week: 'Tuesday',
        hour_of_day: 8,
      },
      {
        sales_rep_id: sales_rep_c_id,
        activity_type: 'proposal',
        activity_date: '2024-01-11T11:00:00Z',
      },
      {
        sales_rep_id: sales_rep_c_id,
        activity_type: 'contract',
        activity_date: '2024-01-20T09:00:00Z',
      },
      {
        sales_rep_id: sales_rep_c_id,
        activity_type: 'visit',
        activity_date: '2024-01-25T08:15:00Z',
        day_of_week: 'Thursday',
        hour_of_day: 8,
      },
    ];

    const all_activities = [
      ...rep_a_activities,
      ...rep_b_activities,
      ...rep_c_activities,
    ];

    // 行動パターン分析レポート生成関数を実行
    const generated_reports = generateSalesRepBehaviorAnalysisReport({
      analysis_start_date,
      analysis_end_date,
      activities: all_activities,
    });

    // レポート数の検証（営業担当者ごとに1つずつ）
    expect(generated_reports).toHaveLength(3);

    // 営業担当者Aのレポート検証
    const report_a = generated_reports.find(
      (r) => r.sales_rep_id === sales_rep_a_id
    );
    expect(report_a).toBeDefined();
    expect(report_a!.sales_rep_id).toBe(sales_rep_a_id);
    expect(report_a!.analysis_start_date).toBe(analysis_start_date);
    expect(report_a!.analysis_end_date).toBe(analysis_end_date);

    // 営業担当者Aの訪問パターン検証
    expect(report_a!.visit_count).toBe(3);
    expect(report_a!.visit_pattern_by_day_of_week).toEqual({
      Friday: 3,
    });
    expect(report_a!.visit_pattern_by_hour).toEqual({
      9: 2,
      10: 1,
    });

    // 営業担当者Aの提案から受注までの平均日数検証
    // 提案日時: 2024-01-08、受注日時: 2024-01-18 → 10日
    expect(report_a!.proposal_to_contract_avg_days).toBe(10);

    // 営業担当者Aの月ごとの活動傾向検証
    expect(report_a!.monthly_activity_trend).toEqual({
      '2024-01': {
        visit_count: 3,
        proposal_count: 1,
        contract_count: 1,
      },
    });

    // 営業担当者Bのレポート検証
    const report_b = generated_reports.find(
      (r) => r.sales_rep_id === sales_rep_b_id
    );
    expect(report_b).toBeDefined();
    expect(report_b!.sales_rep_id).toBe(sales_rep_b_id);
    expect(report_b!.analysis_start_date).toBe(analysis_start_date);
    expect(report_b!.analysis_end_date).toBe(analysis_end_date);

    // 営業担当者Bの訪問パターン検証
    expect(report_b!.visit_count).toBe(3);
    expect(report_b!.visit_pattern_by_day_of_week).toEqual({
      Wednesday: 3,
    });
    expect(report_b!.visit_pattern_by_hour).toEqual({
      13: 2,
      14: 1,
    });

    // 営業担当者Bの提案から受注までの平均日数検証
    // 提案日時: 2024-01-06、受注日時: 2024-01-15 → 9日
    expect(report_b!.proposal_to_contract_avg_days).toBe(9);

    // 営業担当者Bの月ごとの活動傾向検証
    expect(report_b!.monthly_activity_trend).toEqual({
      '2024-01': {
        visit_count: 3,
        proposal_count: 1,
        contract_count: 1,
      },
    });

    // 営業担当者Cのレポート検証
    const report_c = generated_reports.find(
      (r) => r.sales_rep_id === sales_rep_c_id
    );
    expect(report_c).toBeDefined();
    expect(report_c!.sales_rep_id).toBe(sales_rep_c_id);
    expect(report_c!.analysis_start_date).toBe(analysis_start_date);
    expect(report_c!.analysis_end_date).toBe(analysis_end_date);

    // 営業担当者Cの訪問パターン検証
    expect(report_c!.visit_count).toBe(3);
    expect(report_c!.visit_pattern_by_day_of_week).toEqual({
      Tuesday: 2,
      Thursday: 1,
    });
    expect(report_c!.visit_pattern_by_hour).toEqual({
      8: 3,
    });

    // 営業担当者Cの提案から受注までの平均日数検証
    // 提案日時: 2024-01-11、受注日時: 2024-01-20 → 9日
    expect(report_c!.proposal_to_contract_avg_days).toBe(9);

    // 営業担当者Cの月ごとの活動傾向検証
    expect(report_c!.monthly_activity_trend).toEqual({
      '2024-01': {
        visit_count: 3,
        proposal_count: 1,
        contract_count: 1,
      },
    });

    // 各レポートのタイムスタンプと実行日時の検証
    expect(report_a!.report_generated_at).toBeDefined();
    expect(report_b!.report_generated_at).toBeDefined();
    expect(report_c!.report_generated_at).toBeDefined();

    // 各レポートが独立したファイルとして出力可能なことを確認
    expect(report_a!.report_id).toBeDefined();
    expect(report_b!.report_id).toBeDefined();
    expect(report_c!.report_id).toBeDefined();

    // 各レポートのIDが一意であることを確認
    const report_ids = [report_a!.report_id, report_b!.report_id, report_c!.report_id];
    expect(new Set(report_ids).size).toBe(3);
  });
});