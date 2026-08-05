import { analyzeAndGenerateSalesReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-646: 分析対象期間が月初を含むとき、月初データが正確に集計される', () => {
    // 分析期間：2024年4月1日～4月5日
    const analysis_start_date = new Date('2024-04-01T00:00:00Z');
    const analysis_end_date = new Date('2024-04-05T23:59:59Z');

    // テストデータ：営業活動記録
    // 2024年4月1日：3件の商談
    // 2024年4月2日：2件の成約
    const sales_activity_records = [
      {
        activity_id: 'SA001',
        sales_rep_id: 'REP001',
        customer_id: 'CUST001',
        activity_date: new Date('2024-04-01T09:00:00Z'),
        activity_type: 'deal',
        deal_count: 1,
      },
      {
        activity_id: 'SA002',
        sales_rep_id: 'REP001',
        customer_id: 'CUST002',
        activity_date: new Date('2024-04-01T10:30:00Z'),
        activity_type: 'deal',
        deal_count: 1,
      },
      {
        activity_id: 'SA003',
        sales_rep_id: 'REP001',
        customer_id: 'CUST003',
        activity_date: new Date('2024-04-01T14:00:00Z'),
        activity_type: 'deal',
        deal_count: 1,
      },
      {
        activity_id: 'SA004',
        sales_rep_id: 'REP001',
        customer_id: 'CUST001',
        activity_date: new Date('2024-04-02T08:00:00Z'),
        activity_type: 'contract',
        contract_count: 1,
      },
      {
        activity_id: 'SA005',
        sales_rep_id: 'REP001',
        customer_id: 'CUST002',
        activity_date: new Date('2024-04-02T11:00:00Z'),
        activity_type: 'contract',
        contract_count: 1,
      },
      {
        activity_id: 'SA006',
        sales_rep_id: 'REP002',
        customer_id: 'CUST004',
        activity_date: new Date('2024-04-03T09:00:00Z'),
        activity_type: 'deal',
        deal_count: 1,
      },
    ];

    // 成約実績データ
    const contract_results = [
      {
        contract_id: 'CT001',
        sales_rep_id: 'REP001',
        customer_id: 'CUST001',
        contract_date: new Date('2024-04-02T08:00:00Z'),
        contract_amount: 100000,
        status: 'completed',
      },
      {
        contract_id: 'CT002',
        sales_rep_id: 'REP001',
        customer_id: 'CUST002',
        contract_date: new Date('2024-04-02T11:00:00Z'),
        contract_amount: 150000,
        status: 'completed',
      },
    ];

    // 営業担当者マスタ
    const sales_rep_master = [
      {
        sales_rep_id: 'REP001',
        sales_rep_name: '山田太郎',
        department: '営業部A',
      },
      {
        sales_rep_id: 'REP002',
        sales_rep_name: '佐藤花子',
        department: '営業部B',
      },
    ];

    // 分析関数を実行
    const report = analyzeAndGenerateSalesReport({
      analysis_start_date,
      analysis_end_date,
      sales_activity_records,
      contract_results,
      sales_rep_master,
    });

    // 期待結果の検証
    // レポートが生成されたことを確認
    expect(report).toBeDefined();
    expect(report.report_id).toBeDefined();
    expect(report.analysis_period_start).toEqual(analysis_start_date);
    expect(report.analysis_period_end).toEqual(analysis_end_date);

    // 日別集計データの検証
    expect(report.daily_aggregation).toBeDefined();
    expect(Array.isArray(report.daily_aggregation)).toBe(true);

    // 2024年4月1日のデータ検証
    const april_1_data = report.daily_aggregation.find(
      (item) =>
        item.aggregation_date.toISOString().split('T')[0] === '2024-04-01'
    );
    expect(april_1_data).toBeDefined();
    expect(april_1_data?.deal_count).toBe(3);
    expect(april_1_data?.contract_count).toBe(0);

    // 2024年4月2日のデータ検証
    const april_2_data = report.daily_aggregation.find(
      (item) =>
        item.aggregation_date.toISOString().split('T')[0] === '2024-04-02'
    );
    expect(april_2_data).toBeDefined();
    expect(april_2_data?.deal_count).toBe(0);
    expect(april_2_data?.contract_count).toBe(2);
    expect(april_2_data?.total_contract_amount).toBe(250000);

    // 2024年4月3日のデータ検証
    const april_3_data = report.daily_aggregation.find(
      (item) =>
        item.aggregation_date.toISOString().split('T')[0] === '2024-04-03'
    );
    expect(april_3_data).toBeDefined();
    expect(april_3_data?.deal_count).toBe(1);
    expect(april_3_data?.contract_count).toBe(0);

    // 営業担当者別集計の検証
    expect(report.sales_rep_aggregation).toBeDefined();
    expect(Array.isArray(report.sales_rep_aggregation)).toBe(true);

    // REP001の集計データ検証
    const rep_001_aggregation = report.sales_rep_aggregation.find(
      (item) => item.sales_rep_id === 'REP001'
    );
    expect(rep_001_aggregation).toBeDefined();
    expect(rep_001_aggregation?.total_deal_count).toBe(3);
    expect(rep_001_aggregation?.total_contract_count).toBe(2);
    expect(rep_001_aggregation?.total_contract_amount).toBe(250000);
    expect(rep_001_aggregation?.contract_success_rate).toBe(66.67); // (2/3)*100

    // REP002の集計データ検証
    const rep_002_aggregation = report.sales_rep_aggregation.find(
      (item) => item.sales_rep_id === 'REP002'
    );
    expect(rep_002_aggregation).toBeDefined();
    expect(rep_002_aggregation?.total_deal_count).toBe(1);
    expect(rep_002_aggregation?.total_contract_count).toBe(0);
    expect(rep_002_aggregation?.contract_success_rate).toBe(0);

    // 月初データの精度確認（4月1日が他の期間と同じ精度で集計されているか）
    expect(april_1_data?.aggregation_date.getDate()).toBe(1);
    expect(april_1_data?.deal_count).toStrictEqual(april_3_data?.deal_count);

    // レポートの生成タイムスタンプが現在時刻付近であることを確認
    const now = new Date();
    const report_generated_time = new Date(report.generated_at);
    const time_diff_ms = Math.abs(
      now.getTime() - report_generated_time.getTime()
    );
    expect(time_diff_ms).toBeLessThan(5000); // 5秒以内
  });
});