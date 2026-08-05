import { calculateSalesTeamStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-875: [normal] 月次営業品質統計分析機能 - 営業担当者が複数人の場合に統計値が正常に算出される
  test('複数営業担当者の統計分析結果が正常に算出される', () => {
    const salesRepresentativeDataList = [
      {
        sales_rep_id: 'rep_001',
        sales_rep_name: '営業担当者A',
        monthly_sales_count: 5,
        monthly_sales_amount: 5000000,
        contract_rate: 60,
      },
      {
        sales_rep_id: 'rep_002',
        sales_rep_name: '営業担当者B',
        monthly_sales_count: 8,
        monthly_sales_amount: 8000000,
        contract_rate: 75,
      },
      {
        sales_rep_id: 'rep_003',
        sales_rep_name: '営業担当者C',
        monthly_sales_count: 3,
        monthly_sales_amount: 3000000,
        contract_rate: 50,
      },
    ];

    const analysis_period = '2024-01';
    const target_date = new Date('2024-01-31T23:59:59Z');

    const result = calculateSalesTeamStatistics(
      salesRepresentativeDataList,
      analysis_period,
      target_date
    );

    // 平均売上件数: (5 + 8 + 3) / 3 = 16 / 3 = 5.33件
    expect(result.average_sales_count).toBeCloseTo(5.33, 2);

    // 平均売上金額: (5000000 + 8000000 + 3000000) / 3 = 16000000 / 3 = 5333333.33円
    expect(result.average_sales_amount).toBeCloseTo(5333333.33, 2);

    // 平均成約率: (60 + 75 + 50) / 3 = 185 / 3 = 61.67%
    expect(result.average_contract_rate).toBeCloseTo(61.67, 2);

    // 総売上件数: 5 + 8 + 3 = 16件
    expect(result.total_sales_count).toBe(16);

    // 総売上金額: 5000000 + 8000000 + 3000000 = 16000000円
    expect(result.total_sales_amount).toBe(16000000);

    // 最高成約率: 75%（営業担当者B）
    expect(result.highest_contract_rate).toBe(75);
    expect(result.highest_contract_rate_rep_name).toBe('営業担当者B');

    // 最低成約率: 50%（営業担当者C）
    expect(result.lowest_contract_rate).toBe(50);
    expect(result.lowest_contract_rate_rep_name).toBe('営業担当者C');

    // 分析対象期間が正しく記録される
    expect(result.analysis_period).toBe('2024-01');

    // 分析対象人数が正しく記録される
    expect(result.analyzed_rep_count).toBe(3);

    // 分析実行時刻が記録される
    expect(result.analysis_executed_at).toBeDefined();
    expect(typeof result.analysis_executed_at).toBe('string');
  });
});