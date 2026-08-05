import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-480
  test('営業活動ログの実行日時が分析期間外の場合、エラーを返す', () => {
    const analysis_period_start = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end = new Date('2024-01-31T23:59:59Z');
    
    const activity_log_out_of_period = {
      activity_log_id: 'log_001',
      salesperson_id: 'sp_001',
      execution_date: new Date('2023-12-15T10:30:00Z'),
      activity_type: 'visit',
      customer_id: 'cust_001',
      duration_minutes: 30,
      notes: 'Initial contact'
    };

    const sales_activity_logs = [activity_log_out_of_period];

    const input = {
      analysis_period_start,
      analysis_period_end,
      sales_activity_logs
    };

    expect(() => generateSalesActivityPatternAnalysisReport(input)).toThrow(
      /OUT_OF_ANALYSIS_PERIOD/
    );
  });
});