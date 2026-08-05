import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-1051
  test('ガイドライン配布日と理解度確認テスト提出日が同日で集計対象になる', () => {
    const report_period_start = new Date('2024-01-01');
    const report_period_end = new Date('2024-01-31');
    const guideline_distribution_date = new Date('2024-01-15');
    const understanding_confirmation_submission_date = new Date('2024-01-15');

    const salesperson_a_data = {
      salesperson_id: 'SP001',
      salesperson_name: '営業担当者A',
      guideline_distribution_date: guideline_distribution_date,
      understanding_confirmation_submission_date: understanding_confirmation_submission_date,
      action_records: [
        {
          activity_id: 'ACT001',
          activity_date: new Date('2024-01-15'),
          activity_type: 'guideline_distribution',
          timestamp: guideline_distribution_date,
        },
        {
          activity_id: 'ACT002',
          activity_date: new Date('2024-01-15'),
          activity_type: 'understanding_confirmation_submission',
          timestamp: understanding_confirmation_submission_date,
        },
      ],
    };

    const salesperson_records = [salesperson_a_data];

    const result = generateSalesActivityPatternReport({
      report_period_start: report_period_start,
      report_period_end: report_period_end,
      salesperson_records: salesperson_records,
    });

    expect(result).toBeDefined();
    expect(result.report_status).toBe('completed');

    const salesperson_a_pattern = result.salesperson_patterns.find(
      (pattern) => pattern.salesperson_id === 'SP001'
    );

    expect(salesperson_a_pattern).toBeDefined();
    expect(salesperson_a_pattern.salesperson_id).toBe('SP001');
    expect(salesperson_a_pattern.salesperson_name).toBe('営業担当者A');

    const aggregated_events = salesperson_a_pattern.aggregated_events;
    expect(aggregated_events).toBeDefined();
    expect(aggregated_events.length).toBe(2);

    const distribution_event = aggregated_events.find(
      (event) => event.event_type === 'guideline_distribution'
    );
    expect(distribution_event).toBeDefined();
    expect(distribution_event.event_date).toEqual(new Date('2024-01-15'));
    expect(distribution_event.is_included_in_period).toBe(true);

    const submission_event = aggregated_events.find(
      (event) => event.event_type === 'understanding_confirmation_submission'
    );
    expect(submission_event).toBeDefined();
    expect(submission_event.event_date).toEqual(new Date('2024-01-15'));
    expect(submission_event.is_included_in_period).toBe(true);

    expect(salesperson_a_pattern.days_elapsed).toBe(0);
    expect(salesperson_a_pattern.guideline_distribution_date).toEqual(new Date('2024-01-15'));
    expect(salesperson_a_pattern.understanding_confirmation_submission_date).toEqual(
      new Date('2024-01-15')
    );
  });
});