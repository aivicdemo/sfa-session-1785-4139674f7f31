import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-221: [normal] 行動パターン分析レポート生成機能 - 営業担当者複数名の商談記録から個別の行動パターン分析レポートが生成される
  test('should generate individual behavior pattern analysis reports for multiple sales representatives', () => {
    // Arrange: 営業担当者A、B、Cの商談記録データを準備
    const salesRepA_id = 'SR001';
    const salesRepA_name = 'Alice';
    const salesRepB_id = 'SR002';
    const salesRepB_name = 'Bob';
    const salesRepC_id = 'SR003';
    const salesRepC_name = 'Charlie';

    const analysis_start_date = new Date('2024-11-15T00:00:00Z');
    const analysis_end_date = new Date('2024-12-15T00:00:00Z');

    // 営業担当者Aの商談記録（10件以上）
    const dealRecordsA = [
      {
        deal_id: 'D_A_001',
        sales_rep_id: salesRepA_id,
        customer_id: 'C001',
        initial_contact_date: new Date('2024-11-16T09:00:00Z'),
        proposal_sent_date: new Date('2024-11-18T14:00:00Z'),
        deal_closed_date: new Date('2024-11-25T16:30:00Z'),
        proposal_count: 2,
        follow_up_count: 3,
      },
      {
        deal_id: 'D_A_002',
        sales_rep_id: salesRepA_id,
        customer_id: 'C002',
        initial_contact_date: new Date('2024-11-17T10:00:00Z'),
        proposal_sent_date: new Date('2024-11-19T15:00:00Z'),
        deal_closed_date: new Date('2024-11-26T17:00:00Z'),
        proposal_count: 1,
        follow_up_count: 2,
      },
      {
        deal_id: 'D_A_003',
        sales_rep_id: salesRepA_id,
        customer_id: 'C003',
        initial_contact_date: new Date('2024-11-18T11:00:00Z'),
        proposal_sent_date: new Date('2024-11-20T16:00:00Z'),
        deal_closed_date: new Date('2024-11-27T18:00:00Z'),
        proposal_count: 3,
        follow_up_count: 4,
      },
      {
        deal_id: 'D_A_004',
        sales_rep_id: salesRepA_id,
        customer_id: 'C004',
        initial_contact_date: new Date('2024-11-19T12:00:00Z'),
        proposal_sent_date: new Date('2024-11-21T17:00:00Z'),
        deal_closed_date: new Date('2024-11-28T19:00:00Z'),
        proposal_count: 2,
        follow_up_count: 3,
      },
      {
        deal_id: 'D_A_005',
        sales_rep_id: salesRepA_id,
        customer_id: 'C005',
        initial_contact_date: new Date('2024-11-20T13:00:00Z'),
        proposal_sent_date: new Date('2024-11-22T18:00:00Z'),
        deal_closed_date: new Date('2024-11-29T20:00:00Z'),
        proposal_count: 1,
        follow_up_count: 2,
      },
      {
        deal_id: 'D_A_006',
        sales_rep_id: salesRepA_id,
        customer_id: 'C006',
        initial_contact_date: new Date('2024-11-21T14:00:00Z'),
        proposal_sent_date: new Date('2024-11-23T19:00:00Z'),
        deal_closed_date: new Date('2024-11-30T21:00:00Z'),
        proposal_count: 2,
        follow_up_count: 3,
      },
      {
        deal_id: 'D_A_007',
        sales_rep_id: salesRepA_id,
        customer_id: 'C007',
        initial_contact_date: new Date('2024-11-22T15:00:00Z'),
        proposal_sent_date: new Date('2024-11-24T20:00:00Z'),
        deal_closed_date: new Date('2024-12-01T22:00:00Z'),
        proposal_count: 3,
        follow_up_count: 4,
      },
      {
        deal_id: 'D_A_008',
        sales_rep_id: salesRepA_id,
        customer_id: 'C008',
        initial_contact_date: new Date('2024-11-23T16:00:00Z'),
        proposal_sent_date: new Date('2024-11-25T21:00:00Z'),
        deal_closed_date: new Date('2024-12-02T23:00:00Z'),
        proposal_count: 1,
        follow_up_count: 2,
      },
      {
        deal_id: 'D_A_009',
        sales_rep_id: salesRepA_id,
        customer_id: 'C009',
        initial_contact_date: new Date('2024-11-24T17:00:00Z'),
        proposal_sent_date: new Date('2024-11-26T22:00:00Z'),
        deal_closed_date: new Date('2024-12-03T00:00:00Z'),
        proposal_count: 2,
        follow_up_count: 3,
      },
      {
        deal_id: 'D_A_010',
        sales_rep_id: salesRepA_id,
        customer_id: 'C010',
        initial_contact_date: new Date('2024-11-25T18:00:00Z'),
        proposal_sent_date: new Date('2024-11-27T23:00:00Z'),
        deal_closed_date: new Date('2024-12-04T01:00:00Z'),
        proposal_count: 3,
        follow_up_count: 4,
      },
    ];

    // 営業担当者Bの商談記録（10件以上）
    const dealRecordsB = [
      {
        deal_id: 'D_B_001',
        sales_rep_id: salesRepB_id,
        customer_id: 'C011',
        initial_contact_date: new Date('2024-11-16T09:00:00Z'),
        proposal_sent_date: new Date('2024-11-20T14:00:00Z'),
        deal_closed_date: new Date('2024-12-02T16:30:00Z'),
        proposal_count: 4,
        follow_up_count: 5,
      },
      {
        deal_id: 'D_B_002',
        sales_rep_id: salesRepB_id,
        customer_id: 'C012',
        initial_contact_date: new Date('2024-11-17T10:00:00Z'),
        proposal_sent_date: new Date('2024-11-21T15:00:00Z'),
        deal_closed_date: new Date('2024-12-03T17:00:00Z'),
        proposal_count: 3,
        follow_up_count: 4,
      },
      {
        deal_id: 'D_B_003',
        sales_rep_id: salesRepB_id,
        customer_id: 'C013',
        initial_contact_date: new Date('2024-11-18T11:00:00Z'),
        proposal_sent_date: new Date('2024-11-22T16:00:00Z'),
        deal_closed_date: new Date('2024-12-04T18:00:00Z'),
        proposal_count: 5,
        follow_up_count: 6,
      },
      {
        deal_id: 'D_B_004',
        sales_rep_id: salesRepB_id,
        customer_id: 'C014',
        initial_contact_date: new Date('2024-11-19T12:00:00Z'),
        proposal_sent_date: new Date('2024-11-23T17:00:00Z'),
        deal_closed_date: new Date('2024-12-05T19:00:00Z'),
        proposal_count: 4,
        follow_up_count: 5,
      },
      {
        deal_id: 'D_B_005',
        sales_rep_id: salesRepB_id,
        customer_id: 'C015',
        initial_contact_date: new Date('2024-11-20T13:00:00Z'),
        proposal_sent_date: new Date('2024-11-24T18:00:00Z'),
        deal_closed_date: new Date('2024-12-06T20:00:00Z'),
        proposal_count: 3,
        follow_up_count: 4,
      },
      {
        deal_id: 'D_B_006',
        sales_rep_id: salesRepB_id,
        customer_id: 'C016',
        initial_contact_date: new Date('2024-11-21T14:00:00Z'),
        proposal_sent_date: new Date('2024-11-25T19:00:00Z'),
        deal_closed_date: new Date('2024-12-07T21:00:00Z'),
        proposal_count: 4,
        follow_up_count: 5,
      },
      {
        deal_id: 'D_B_007',
        sales_rep_id: salesRepB_id,
        customer_id: 'C017',
        initial_contact_date: new Date('2024-11-22T15:00:00Z'),
        proposal_sent_date: new Date('2024-11-26T20:00:00Z'),
        deal_closed_date: new Date('2024-12-08T22:00:00Z'),
        proposal_count: 5,
        follow_up_count: 6,
      },
      {
        deal_id: 'D_B_008',
        sales_rep_id: salesRepB_id,
        customer_id: 'C018',
        initial_contact_date: new Date('2024-11-23T16:00:00Z'),
        proposal_sent_date: new Date('2024-11-27T21:00:00Z'),
        deal_closed_date: new Date('2024-12-09T23:00:00Z'),
        proposal_count: 3,
        follow_up_count: 4,
      },
      {
        deal_id: 'D_B_009',
        sales_rep_id: salesRepB_id,
        customer_id: 'C019',
        initial_contact_date: new Date('2024-11-24T17:00:00Z'),
        proposal_sent_date: new Date('2024-11-28T22:00:00Z'),
        deal_closed_date: new Date('2024-12-10T00:00:00Z'),
        proposal_count: 4,
        follow_up_count: 5,
      },
      {
        deal_id: 'D_B_010',
        sales_rep_id: salesRepB_id,
        customer_id: 'C020',
        initial_contact_date: new Date('2024-11-25T18:00:00Z'),
        proposal_sent_date: new Date('2024-11-29T23:00:00Z'),
        deal_closed_date: new Date('2024-12-11T01:00:00Z'),
        proposal_count: 5,
        follow_up_count: 6,
      },
    ];

    // 営業担当者Cの商談記録（10件以上）
    const dealRecordsC = [
      {
        deal_id: 'D_C_001',
        sales_rep_id: salesRepC_id,
        customer_id: 'C021',
        initial_contact_date: new Date('2024-11-16T09:00:00Z'),
        proposal_sent_date: new Date('2024-11-17T14:00:00Z'),
        deal_closed_date: new Date('2024-11-19T16:30:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_002',
        sales_rep_id: salesRepC_id,
        customer_id: 'C022',
        initial_contact_date: new Date('2024-11-17T10:00:00Z'),
        proposal_sent_date: new Date('2024-11-18T15:00:00Z'),
        deal_closed_date: new Date('2024-11-20T17:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_003',
        sales_rep_id: salesRepC_id,
        customer_id: 'C023',
        initial_contact_date: new Date('2024-11-18T11:00:00Z'),
        proposal_sent_date: new Date('2024-11-19T16:00:00Z'),
        deal_closed_date: new Date('2024-11-21T18:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_004',
        sales_rep_id: salesRepC_id,
        customer_id: 'C024',
        initial_contact_date: new Date('2024-11-19T12:00:00Z'),
        proposal_sent_date: new Date('2024-11-20T17:00:00Z'),
        deal_closed_date: new Date('2024-11-22T19:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_005',
        sales_rep_id: salesRepC_id,
        customer_id: 'C025',
        initial_contact_date: new Date('2024-11-20T13:00:00Z'),
        proposal_sent_date: new Date('2024-11-21T18:00:00Z'),
        deal_closed_date: new Date('2024-11-23T20:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_006',
        sales_rep_id: salesRepC_id,
        customer_id: 'C026',
        initial_contact_date: new Date('2024-11-21T14:00:00Z'),
        proposal_sent_date: new Date('2024-11-22T19:00:00Z'),
        deal_closed_date: new Date('2024-11-24T21:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_007',
        sales_rep_id: salesRepC_id,
        customer_id: 'C027',
        initial_contact_date: new Date('2024-11-22T15:00:00Z'),
        proposal_sent_date: new Date('2024-11-23T20:00:00Z'),
        deal_closed_date: new Date('2024-11-25T22:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_008',
        sales_rep_id: salesRepC_id,
        customer_id: 'C028',
        initial_contact_date: new Date('2024-11-23T16:00:00Z'),
        proposal_sent_date: new Date('2024-11-24T21:00:00Z'),
        deal_closed_date: new Date('2024-11-26T23:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_009',
        sales_rep_id: salesRepC_id,
        customer_id: 'C029',
        initial_contact_date: new Date('2024-11-24T17:00:00Z'),
        proposal_sent_date: new Date('2024-11-25T22:00:00Z'),
        deal_closed_date: new Date('2024-11-27T00:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
      {
        deal_id: 'D_C_010',
        sales_rep_id: salesRepC_id,
        customer_id: 'C030',
        initial_contact_date: new Date('2024-11-25T18:00:00Z'),
        proposal_sent_date: new Date('2024-11-26T23:00:00Z'),
        deal_closed_date: new Date('2024-11-28T01:00:00Z'),
        proposal_count: 1,
        follow_up_count: 1,
      },
    ];

    const all_deal_records = [...dealRecordsA, ...dealRecordsB, ...dealRecordsC];
    const sales_reps = [
      { id: salesRepA_id, name: salesRepA_name },
      { id: salesRepB_id, name: salesRepB_name },
      { id: salesRepC_id, name: salesRepC_name },
    ];

    // Act: 行動パターン分析レポート生成機能を実行
    const report = generateSalesActivityPatternReport({
      deal_records: all_deal_records,
      sales_representatives: sales_reps,
      analysis_period_start: analysis_start_date,
      analysis_period_end: analysis_end_date,
    });

    // Assert: 生成されたレポートが営業担当者ごとに分割されていることを確認
    expect(report.reports).toHaveLength(3);
    expect(report.reports.map((r) => r.sales_rep_id)).toEqual([
      salesRepA_id,
      salesRepB_id,
      salesRepC_id,
    ]);

    // 営業担当者Aのレポート検証
    const reportA = report.reports.find((r) => r.sales_rep_id === salesRepA_id);
    expect(reportA).toBeDefined();
    expect(reportA!.sales_rep_id).toBe(salesRepA_id);
    expect(reportA!.sales_rep_name).toBe(salesRepA_name);
    expect(reportA!.deal_records_count).toBe(10);

    // 営業担当者Aの初回接触から成約までの平均日数を計算
    // D_A_001: 9日, D_A_002: 9日, D_A_003: 9日, D_A_004: 9日, D_A_005: 9日,
    // D_A_006: 9日, D_A_007: 9日, D_A_008: 9日, D_A_009: 9日, D_A_010: 9日
    // 平均: 9日
    expect(reportA!.avg_days_from_initial_contact_to_deal_closed).toBe(9);

    // 営業担当者Aの提案資料送付の平均回数を計算
    // 提案回数: 2, 1, 3, 2, 1, 2, 3, 1, 2, 3 = 合計20回 / 10件 = 2.0回
    expect(reportA!.avg_proposal_count).toBe(2);

    // 営業担当者Aの顧客フォローアップ頻度（週単位での接触回数）を計算
    // フォローアップ回数: 3, 2, 4, 3, 2, 3, 4, 2, 3, 4 = 合計30回
    // 分析期間: 30日 (約4.3週) → 週単位の接触回数 = 30 / 4.3 ≈ 7.0回/週
    expect(reportA!.avg_followup_frequency_per_week).toBeCloseTo(7.0, 1);

    // 営業担当者Bのレポート検証
    const reportB = report.reports.find((r) => r.sales_rep_id === salesRepB_id);
    expect(reportB).toBeDefined();
    expect(reportB!.sales_rep_id).toBe(salesRepB_id);
    expect(reportB!.sales_rep_name).toBe(salesRepB_name);
    expect(reportB!.deal_records_count).toBe(10);

    // 営業担当者Bの初回接触から成約までの平均日数を計算
    // D_B_001: 16日, D_B_002: 16日, D_B_003: 16日, D_B_004: 16日, D_B_005: 16日,
    // D_B_006: 16日, D_B_007: 16日, D_B_008: 16日, D_B_009: 16日, D_B_010: 16日
    // 平均: 16日
    expect(reportB!.avg_days_from_initial_contact_to_deal_closed).toBe(16);

    // 営業担当者Bの提案資料送付の平均回数を計算
    // 提案回数: 4, 3, 5, 4, 3, 4, 5, 3, 4, 5 = 合計40回 / 10件 = 4.0回
    expect(reportB!.avg_proposal_count).toBe(4);

    // 営業担当者Bの顧客フォローアップ頻度を計算
    // フォローアップ回数: 5, 4, 6, 5, 4, 5, 6, 4, 5, 6 = 合計50回
    // 分析期間: 30日 (約4.3週) → 週単位の接触回数 = 50 / 4.3 ≈ 11.6回/週
    expect(reportB!.avg_followup_frequency_per_week).toBeCloseTo(11.6, 1);

    // 営業担当者Cのレポート検証
    const reportC = report.reports.find((r) => r.sales_rep_id === salesRepC_id);
    expect(reportC).toBeDefined();
    expect(reportC!.sales_rep_id).toBe(salesRepC_id);
    expect(reportC!.sales_rep_name).toBe(salesRepC_name);
    expect(reportC!.deal_records_count).toBe(10);

    // 営業担当者Cの初回接触から成約までの平均日数を計算
    // D_C_001: 3日, D_C_002: 3日, D_C_003: 3日, D_C_004: 3日, D_C_005: 3日,
    // D_C_006: 3日, D_C_007: 3日, D_C_008: 3日, D_C_009: 3日, D_C_010: 3日
    // 平均: 3日
    expect(reportC!.avg_days_from_initial_contact_to_deal_closed).toBe(3);

    // 営業担当者Cの提案資料送付の平均回数を計算
    // 提案回数: 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 = 合計10回 / 10件 = 1.0回
    expect(reportC!.avg_proposal_count).toBe(1);

    // 営業担当者Cの顧客フォローアップ頻度を計算
    // フォローアップ回数: 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 = 合計10回
    // 分析期間: 30日 (約4.3週) → 週単位の接触回数 = 10 / 4.3 ≈ 2.3回/週
    expect(reportC!.avg_followup_frequency_per_week).toBeCloseTo(2.3, 1);

    // 営業担当者ごとの行動パターン値が異なることを確認
    expect(reportA!.avg_days_from_initial_contact_to_deal_closed).not.toBe(
      reportB!.avg_days_from_initial_contact_to_deal_closed,
    );
    expect(reportB!.avg_days_from_initial_contact_to_deal_closed).not.toBe(
      reportC!.avg_days_from_initial_contact_to_deal_closed,
    );
    expect(reportA!.avg_proposal_count).not.toBe(reportB!.avg_proposal_count);
    expect(reportB!.avg_proposal_count).not.toBe(reportC!.avg_proposal_count);
    expect(reportA!.avg_followup_frequency_per_week).not.toBeCloseTo(
      reportB!.avg_followup_frequency_per_week,
      0,
    );
    expect(reportB!.avg_followup_frequency_per_week).not.toBeCloseTo(
      reportC!.avg_followup_frequency_per_week,
      0,
    );
  });
});