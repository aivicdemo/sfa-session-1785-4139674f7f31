import { generateSalesProcessComplianceReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-147
  test('乖離度が0%のとき、標準プロセス遵守度スコアが100として計算される', () => {
    const sales_rep_id = 'SR001';
    const sales_rep_name = '営業担当者A';
    const deviation_percentage = 0;
    const total_deals = 10;
    const successful_deals = 8;
    const contact_count = 25;
    const proposal_count = 20;
    const follow_up_count = 15;
    const average_deal_days = 45;

    const input = {
      sales_rep_id,
      sales_rep_name,
      deviation_percentage,
      total_deals,
      successful_deals,
      contact_count,
      proposal_count,
      follow_up_count,
      average_deal_days,
      analysis_period_start: '2024-01-01',
      analysis_period_end: '2024-01-31',
    };

    const result = generateSalesProcessComplianceReport(input);

    expect(result.sales_rep_id).toBe('SR001');
    expect(result.sales_rep_name).toBe('営業担当者A');
    expect(result.process_compliance_score).toBe(100);
    expect(result.deviation_percentage).toBe(0);
    expect(result.success_rate).toBe(80);
    expect(result.analysis_period_start).toBe('2024-01-01');
    expect(result.analysis_period_end).toBe('2024-01-31');
    expect(typeof result.report_id).toBe('string');
    expect(typeof result.generated_at).toBe('string');
  });
});