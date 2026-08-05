import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-586
  test('複数営業担当者の行動ログに完全に同じタイムスタンプと行動内容が重複している場合、重複検出と統計調整が正常に機能する', () => {
    const report_period_start = new Date('2024-01-15T00:00:00Z');
    const report_period_end = new Date('2024-01-15T23:59:59Z');
    const duplicate_timestamp = '2024-01-15T10:30:45Z';

    const activity_logs = [
      {
        activity_log_id: 'LOG001',
        sales_rep_id: 'REP_A',
        activity_type: 'phone_contact',
        customer_id: 'C001',
        activity_timestamp: duplicate_timestamp,
        activity_notes: 'Phone contact with customer C001',
        created_at: '2024-01-15T10:30:45Z',
      },
      {
        activity_log_id: 'LOG002',
        sales_rep_id: 'REP_B',
        activity_type: 'phone_contact',
        customer_id: 'C001',
        activity_timestamp: duplicate_timestamp,
        activity_notes: 'Phone contact with customer C001',
        created_at: '2024-01-15T10:30:45Z',
      },
      {
        activity_log_id: 'LOG003',
        sales_rep_id: 'REP_A',
        activity_type: 'email_sent',
        customer_id: 'C002',
        activity_timestamp: '2024-01-15T14:22:00Z',
        activity_notes: 'Email sent to customer C002',
        created_at: '2024-01-15T14:22:00Z',
      },
    ];

    const result = generateBehaviorPatternAnalysisReport({
      period_start: report_period_start,
      period_end: report_period_end,
      activity_logs: activity_logs,
    });

    expect(result.report_type).toBe('behavior_pattern_analysis');
    expect(result.analysis_period.start).toEqual(report_period_start);
    expect(result.analysis_period.end).toEqual(report_period_end);

    expect(result.duplicate_detection).toBeDefined();
    expect(result.duplicate_detection.duplicate_log_count).toBe(2);
    expect(result.duplicate_detection.duplicate_records).toHaveLength(1);

    const duplicate_record = result.duplicate_detection.duplicate_records[0];
    expect(duplicate_record.duplicate_timestamp).toBe(duplicate_timestamp);
    expect(duplicate_record.activity_type).toBe('phone_contact');
    expect(duplicate_record.customer_id).toBe('C001');
    expect(duplicate_record.affected_sales_reps).toContain('REP_A');
    expect(duplicate_record.affected_sales_reps).toContain('REP_B');
    expect(duplicate_record.affected_sales_reps).toHaveLength(2);

    expect(result.statistics).toBeDefined();
    expect(result.statistics.total_activity_logs_raw).toBe(3);
    expect(result.statistics.total_activity_logs_deduplicated).toBe(2);
    expect(result.statistics.duplicate_logs_excluded).toBe(1);

    expect(result.analysis_summary).toBeDefined();
    expect(result.analysis_summary.anomaly_flags).toBeDefined();
    expect(result.analysis_summary.anomaly_flags.duplicate_activity_detected).toBe(true);
    expect(result.analysis_summary.anomaly_flags.duplicate_activity_count).toBe(1);

    expect(result.report_generated_at).toBeDefined();
    expect(new Date(result.report_generated_at)).toBeInstanceOf(Date);

    const phone_contact_stats = result.statistics.activity_breakdown.find(
      (stat: { activity_type: string }) => stat.activity_type === 'phone_contact'
    );
    expect(phone_contact_stats).toBeDefined();
    expect(phone_contact_stats.count_deduplicated).toBe(1);
    expect(phone_contact_stats.duplicate_count).toBe(1);
  });
});