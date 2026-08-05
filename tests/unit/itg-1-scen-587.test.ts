import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateSalesActivityPatternAnalysis } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-587
  test('営業活動ログが時系列と逆順で入力される場合、内部で自動ソートして正確な行動パターン分析を実行すること', async () => {
    const sales_representative_id = 'SR001';
    const report_generation_timestamp = new Date('2024-01-16T09:00:00Z');

    const activity_logs = [
      {
        activity_log_id: 'AL003',
        sales_representative_id: sales_representative_id,
        activity_date: new Date('2024-01-15T14:00:00Z'),
        activity_type: 'email',
        customer_id: 'CUST001',
        activity_outcome: 'proposal_sent',
        duration_minutes: 15,
      },
      {
        activity_log_id: 'AL002',
        sales_representative_id: sales_representative_id,
        activity_date: new Date('2024-01-10T10:30:00Z'),
        activity_type: 'phone',
        customer_id: 'CUST001',
        activity_outcome: 'requirement_confirmed',
        duration_minutes: 25,
      },
      {
        activity_log_id: 'AL001',
        sales_representative_id: sales_representative_id,
        activity_date: new Date('2024-01-05T11:00:00Z'),
        activity_type: 'visit',
        customer_id: 'CUST001',
        activity_outcome: 'initial_contact',
        duration_minutes: 45,
      },
    ];

    fetchMock.mockResponseOnce(
      JSON.stringify({
        report_id: 'RPT20240116001',
        sales_representative_id: sales_representative_id,
        report_generation_timestamp: report_generation_timestamp.toISOString(),
        analysis_period_start: new Date('2024-01-05T11:00:00Z').toISOString(),
        analysis_period_end: new Date('2024-01-15T14:00:00Z').toISOString(),
        total_activities: 3,
        activity_type_distribution: {
          visit: 1,
          phone: 1,
          email: 1,
        },
        chronological_sequence: [
          {
            sequence_order: 1,
            activity_log_id: 'AL001',
            activity_date: '2024-01-05T11:00:00Z',
            activity_type: 'visit',
            activity_outcome: 'initial_contact',
          },
          {
            sequence_order: 2,
            activity_log_id: 'AL002',
            activity_date: '2024-01-10T10:30:00Z',
            activity_type: 'phone',
            activity_outcome: 'requirement_confirmed',
          },
          {
            sequence_order: 3,
            activity_log_id: 'AL003',
            activity_date: '2024-01-15T14:00:00Z',
            activity_type: 'email',
            activity_outcome: 'proposal_sent',
          },
        ],
        pattern_analysis_result: {
          sales_cycle_progression: 'early_stage_to_proposal',
          activity_frequency_trend: 'increasing_engagement',
          average_days_between_activities: 5,
          conversion_readiness_score: 72,
          recommended_next_action: 'follow_up_phone_call',
          recommended_action_timing: '2024-01-20T10:00:00Z',
        },
        data_quality_score: 100,
        analysis_confidence_score: 95,
        report_status: 'success',
        http_status_code: 200,
      }),
      { status: 200 }
    );

    const result = await calculateSalesActivityPatternAnalysis({
      sales_representative_id: sales_representative_id,
      activity_logs: activity_logs,
      report_generation_timestamp: report_generation_timestamp,
    });

    expect(result.report_status).toBe('success');
    expect(result.http_status_code).toBe(200);
    expect(result.total_activities).toBe(3);
    expect(result.chronological_sequence).toHaveLength(3);
    expect(result.chronological_sequence[0].sequence_order).toBe(1);
    expect(result.chronological_sequence[0].activity_log_id).toBe('AL001');
    expect(result.chronological_sequence[0].activity_date).toBe('2024-01-05T11:00:00Z');
    expect(result.chronological_sequence[1].sequence_order).toBe(2);
    expect(result.chronological_sequence[1].activity_log_id).toBe('AL002');
    expect(result.chronological_sequence[1].activity_date).toBe('2024-01-10T10:30:00Z');
    expect(result.chronological_sequence[2].sequence_order).toBe(3);
    expect(result.chronological_sequence[2].activity_log_id).toBe('AL003');
    expect(result.chronological_sequence[2].activity_date).toBe('2024-01-15T14:00:00Z');
    expect(result.activity_type_distribution).toEqual({
      visit: 1,
      phone: 1,
      email: 1,
    });
    expect(result.pattern_analysis_result.sales_cycle_progression).toBe(
      'early_stage_to_proposal'
    );
    expect(result.pattern_analysis_result.activity_frequency_trend).toBe(
      'increasing_engagement'
    );
    expect(result.pattern_analysis_result.average_days_between_activities).toBe(5);
    expect(result.pattern_analysis_result.conversion_readiness_score).toBe(72);
    expect(result.pattern_analysis_result.recommended_next_action).toBe(
      'follow_up_phone_call'
    );
    expect(result.data_quality_score).toBe(100);
    expect(result.analysis_confidence_score).toBe(95);
  });
});