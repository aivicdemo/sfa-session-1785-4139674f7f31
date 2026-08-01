import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-162: 商談記録の入力期間の開始日と終了日が同日のとき、正常に計算される', () => {
    const sales_rep_id = 'rep_001';
    const sales_rep_name = '営業太郎';
    const analysis_start_date = new Date('2024-01-15T00:00:00Z');
    const analysis_end_date = new Date('2024-01-15T23:59:59Z');

    const deal_records = [
      {
        deal_record_id: 'deal_001',
        sales_rep_id: sales_rep_id,
        deal_amount: 500000,
        deal_date: new Date('2024-01-15T10:00:00Z'),
      },
      {
        deal_record_id: 'deal_002',
        sales_rep_id: sales_rep_id,
        deal_amount: 1000000,
        deal_date: new Date('2024-01-15T14:00:00Z'),
      },
      {
        deal_record_id: 'deal_003',
        sales_rep_id: sales_rep_id,
        deal_amount: 1500000,
        deal_date: new Date('2024-01-15T16:30:00Z'),
      },
    ];

    const result = generateSalesActivityPatternReport({
      sales_rep_id: sales_rep_id,
      sales_rep_name: sales_rep_name,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      deal_records: deal_records,
    });

    expect(result.analysis_period_start).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(result.analysis_period_end).toEqual(new Date('2024-01-15T23:59:59Z'));
    expect(result.aggregated_deal_count).toBe(3);
    expect(result.total_deal_amount).toBe(3000000);
    expect(result.analysis_days).toBe(1);
    expect(result.average_deal_amount_per_day).toBe(3000000);
  });
});