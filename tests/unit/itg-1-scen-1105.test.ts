import { analyzeDeviationByReasons } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターン分析 - 標準プロセス乖離分析機能', () => {
  // SCEN-1105: [normal] 営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能 - 乖離理由が分類別に数値化・可視化される
  test('乖離理由が分類別に数値化・可視化される', () => {
    // テストデータ: 営業担当者Aの過去3ヶ月間の営業活動記録
    const salesActivities = [
      {
        activity_id: 'act_001',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_001',
        activity_date: new Date('2024-11-05'),
        activity_type: 'initial_contact',
        days_from_previous_stage: 0,
        deviation_reason: 'customer_delay',
        deviation_reason_detail: '顧客都合の遅延'
      },
      {
        activity_id: 'act_002',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_001',
        activity_date: new Date('2024-11-12'),
        activity_type: 'proposal',
        days_from_previous_stage: 7,
        deviation_reason: 'customer_delay',
        deviation_reason_detail: '顧客都合の遅延'
      },
      {
        activity_id: 'act_003',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_002',
        activity_date: new Date('2024-11-20'),
        activity_type: 'initial_contact',
        days_from_previous_stage: 0,
        deviation_reason: 'preparation_shortage',
        deviation_reason_detail: '提案準備不足'
      },
      {
        activity_id: 'act_004',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_002',
        activity_date: new Date('2024-11-25'),
        activity_type: 'proposal',
        days_from_previous_stage: 5,
        deviation_reason: 'customer_delay',
        deviation_reason_detail: '顧客都合の遅延'
      },
      {
        activity_id: 'act_005',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_003',
        activity_date: new Date('2024-12-01'),
        activity_type: 'negotiation',
        days_from_previous_stage: 6,
        deviation_reason: 'market_change',
        deviation_reason_detail: '市場環境変化'
      },
      {
        activity_id: 'act_006',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_003',
        activity_date: new Date('2024-12-08'),
        activity_type: 'contract',
        days_from_previous_stage: 7,
        deviation_reason: 'sales_decision_shortening',
        deviation_reason_detail: '営業判断による短縮'
      },
      {
        activity_id: 'act_007',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_004',
        activity_date: new Date('2024-12-10'),
        activity_type: 'initial_contact',
        days_from_previous_stage: 0,
        deviation_reason: 'customer_delay',
        deviation_reason_detail: '顧客都合の遅延'
      },
      {
        activity_id: 'act_008',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_004',
        activity_date: new Date('2024-12-17'),
        activity_type: 'proposal',
        days_from_previous_stage: 7,
        deviation_reason: 'customer_delay',
        deviation_reason_detail: '顧客都合の遅延'
      },
      {
        activity_id: 'act_009',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_005',
        activity_date: new Date('2024-12-19'),
        activity_type: 'negotiation',
        days_from_previous_stage: 2,
        deviation_reason: 'sales_decision_shortening',
        deviation_reason_detail: '営業判断による短縮'
      },
      {
        activity_id: 'act_010',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_005',
        activity_date: new Date('2024-12-22'),
        activity_type: 'contract',
        days_from_previous_stage: 3,
        deviation_reason: 'sales_decision_shortening',
        deviation_reason_detail: '営業判断による短縮'
      },
      {
        activity_id: 'act_011',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_006',
        activity_date: new Date('2024-12-28'),
        activity_type: 'initial_contact',
        days_from_previous_stage: 0,
        deviation_reason: 'market_change',
        deviation_reason_detail: '市場環境変化'
      },
      {
        activity_id: 'act_012',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_006',
        activity_date: new Date('2025-01-05'),
        activity_type: 'proposal',
        days_from_previous_stage: 8,
        deviation_reason: 'preparation_shortage',
        deviation_reason_detail: '提案準備不足'
      },
      {
        activity_id: 'act_013',
        sales_rep_id: 'rep_A',
        customer_id: 'cust_007',
        activity_date: new Date('2025-01-10'),
        activity_type: 'negotiation',
        days_from_previous_stage: 5,
        deviation_reason: 'customer_delay',
        deviation_reason_detail: '顧客都合の遅延'
      }
    ];

    // 標準プロセス定義: 各段階の平均所要日数、推奨タッチポイント数
    const standardProcessDefinition = {
      initial_contact_to_proposal_avg_days: 5,
      proposal_to_negotiation_avg_days: 7,
      negotiation_to_contract_avg_days: 10,
      recommended_touchpoint_count_per_stage: 1
    };

    // 分析結果を取得
    const analysisResult = analyzeDeviationByReasons({
      sales_activities: salesActivities,
      standard_process_definition: standardProcessDefinition,
      sales_rep_id: 'rep_A'
    });

    // アサーション: 乖離理由が分類別に数値化されていることを確認
    expect(analysisResult).toBeDefined();
    expect(analysisResult.deviation_reasons).toBeDefined();
    expect(Array.isArray(analysisResult.deviation_reasons)).toBe(true);

    // 乖離理由の分類カテゴリが3つ以上あることを確認
    expect(analysisResult.deviation_reasons.length).toBeGreaterThanOrEqual(3);

    // 具体的な分類カテゴリと件数の検証
    const reasonCounts = {
      customer_delay: 0,
      preparation_shortage: 0,
      market_change: 0,
      sales_decision_shortening: 0
    };

    for (const activity of salesActivities) {
      if (activity.deviation_reason === 'customer_delay') {
        reasonCounts.customer_delay += 1;
      } else if (activity.deviation_reason === 'preparation_shortage') {
        reasonCounts.preparation_shortage += 1;
      } else if (activity.deviation_reason === 'market_change') {
        reasonCounts.market_change += 1;
      } else if (activity.deviation_reason === 'sales_decision_shortening') {
        reasonCounts.sales_decision_shortening += 1;
      }
    }

    // 期待値: 顧客都合の遅延 5件、営業判断による短縮 3件、提案準備不足 2件、市場環境変化 2件
    const total_deviations = 13;
    const expected_customer_delay_ratio = (5 / total_deviations * 100).toFixed(1); // 38.5
    const expected_sales_decision_shortening_ratio = (3 / total_deviations * 100).toFixed(1); // 23.1
    const expected_preparation_shortage_ratio = (2 / total_deviations * 100).toFixed(1); // 15.4
    const expected_market_change_ratio = (2 / total_deviations * 100).toFixed(1); // 15.4

    // 各分類カテゴリが期待される結果を含んでいることを確認
    const customer_delay_category = analysisResult.deviation_reasons.find(
      (r: any) => r.reason_code === 'customer_delay'
    );
    expect(customer_delay_category).toBeDefined();
    expect(customer_delay_category.count).toBe(5);
    expect(customer_delay_category.percentage.toFixed(1)).toBe(expected_customer_delay_ratio);

    const sales_decision_category = analysisResult.deviation_reasons.find(
      (r: any) => r.reason_code === 'sales_decision_shortening'
    );
    expect(sales_decision_category).toBeDefined();
    expect(sales_decision_category.count).toBe(3);
    expect(sales_decision_category.percentage.toFixed(1)).toBe(expected_sales_decision_shortening_ratio);

    const preparation_category = analysisResult.deviation_reasons.find(
      (r: any) => r.reason_code === 'preparation_shortage'
    );
    expect(preparation_category).toBeDefined();
    expect(preparation_category.count).toBe(2);
    expect(preparation_category.percentage.toFixed(1)).toBe(expected_preparation_shortage_ratio);

    const market_change_category = analysisResult.deviation_reasons.find(
      (r: any) => r.reason_code === 'market_change'
    );
    expect(market_change_category).toBeDefined();
    expect(market_change_category.count).toBe(2);
    expect(market_change_category.percentage.toFixed(1)).toBe(expected_market_change_ratio);

    // 可視化データが存在することを確認
    expect(analysisResult.visualization_data).toBeDefined();
    expect(analysisResult.visualization_data.chart_type).toBeDefined();
    expect(['bar_chart', 'pie_chart', 'combination'].includes(analysisResult.visualization_data.chart_type)).toBe(true);

    // 各分類が少数点第1位で表示されていることを確認
    for (const reason of analysisResult.deviation_reasons) {
      expect(Number.isFinite(reason.percentage)).toBe(true);
      expect(reason.percentage >= 0 && reason.percentage <= 100).toBe(true);
      const percentageStr = reason.percentage.toString();
      const decimalPart = percentageStr.split('.')[1];
      if (decimalPart) {
        expect(decimalPart.length).toBeLessThanOrEqual(1);
      }
    }

    // 合計が100%（小数第1位で四捨五入後）であることを確認
    const sum_percentages = analysisResult.deviation_reasons.reduce(
      (acc: number, r: any) => acc + parseFloat(r.percentage.toFixed(1)),
      0
    );
    expect(Math.abs(sum_percentages - 100) < 0.2).toBe(true);
  });
});