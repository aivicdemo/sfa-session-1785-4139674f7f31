import { analyzeSellerBehaviorPattern } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-1101: [normal] 営業担当者ごとの行動パターン分析・標準プロセス乖離分析機能 - 営業活動ログ1件の営業担当者について行動パターン分析が実行される
  test('SCEN-1101: should generate behavior pattern analysis report for single sales activity log', () => {
    const seller_id = 'A001';
    const customer_id = 'C123';
    const activity_datetime = new Date('2024-01-15T10:00:00Z');
    const activity_type = '訪問';
    const stay_minutes = 45;
    const analysis_execution_date = new Date('2024-01-15T10:00:00Z');

    const activity_log_record = {
      seller_id: seller_id,
      customer_id: customer_id,
      activity_datetime: activity_datetime,
      activity_type: activity_type,
      stay_minutes: stay_minutes,
    };

    const input_data = {
      seller_id: seller_id,
      activity_logs: [activity_log_record],
      analysis_execution_date: analysis_execution_date,
    };

    const result = analyzeSellerBehaviorPattern(input_data);

    expect(result).toBeDefined();
    expect(result.seller_id).toBe('A001');
    expect(result.visit_frequency_monthly_or_more).toBe(true);
    expect(result.average_stay_minutes).toBe(45);
    expect(result.primary_activity_type).toBe('訪問');
    expect(result.primary_activity_type_ratio).toBe(100);
    expect(result.customer_contact_cycle_type).toBe('初回訪問');
    expect(result.analyzed_log_count).toBe(1);
    expect(result.analysis_execution_date).toEqual(new Date('2024-01-15T10:00:00Z'));
    expect(result.process_deviation_detected).toBeDefined();
    expect(typeof result.process_deviation_detected).toBe('boolean');
  });
});