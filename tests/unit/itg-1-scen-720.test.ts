import { analyzeCustomerInteractionPatternsWithProcessStandard } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-720
  test('月末の顧客対応記録を含む分析期間での集計が正確に行われる', () => {
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-01-31T23:59:59Z');

    const customer_interaction_records = [
      // Early month: 5 records
      {
        id: 'rec_001',
        date: new Date('2024-01-05T09:00:00Z'),
        pattern_type: 'A',
        response_time_hours: 3.9,
        success_flag: true,
      },
      {
        id: 'rec_002',
        date: new Date('2024-01-06T10:30:00Z'),
        pattern_type: 'A',
        response_time_hours: 4.1,
        success_flag: true,
      },
      {
        id: 'rec_003',
        date: new Date('2024-01-08T14:00:00Z'),
        pattern_type: 'A',
        response_time_hours: 3.8,
        success_flag: true,
      },
      {
        id: 'rec_004',
        date: new Date('2024-01-09T11:15:00Z'),
        pattern_type: 'A',
        response_time_hours: 4.0,
        success_flag: false,
      },
      {
        id: 'rec_005',
        date: new Date('2024-01-10T15:45:00Z'),
        pattern_type: 'A',
        response_time_hours: 3.9,
        success_flag: true,
      },
      // Mid month: 10 records
      {
        id: 'rec_006',
        date: new Date('2024-01-15T09:00:00Z'),
        pattern_type: 'B',
        response_time_hours: 6.0,
        success_flag: true,
      },
      {
        id: 'rec_007',
        date: new Date('2024-01-16T10:30:00Z'),
        pattern_type: 'B',
        response_time_hours: 5.9,
        success_flag: true,
      },
      {
        id: 'rec_008',
        date: new Date('2024-01-17T14:00:00Z'),
        pattern_type: 'B',
        response_time_hours: 6.1,
        success_flag: true,
      },
      {
        id: 'rec_009',
        date: new Date('2024-01-18T11:15:00Z'),
        pattern_type: 'B',
        response_time_hours: 5.8,
        success_flag: false,
      },
      {
        id: 'rec_010',
        date: new Date('2024-01-19T15:45:00Z'),
        pattern_type: 'B',
        response_time_hours: 6.2,
        success_flag: true,
      },
      {
        id: 'rec_011',
        date: new Date('2024-01-20T09:30:00Z'),
        pattern_type: 'B',
        response_time_hours: 5.7,
        success_flag: true,
      },
      {
        id: 'rec_012',
        date: new Date('2024-01-21T13:00:00Z'),
        pattern_type: 'C',
        response_time_hours: 3.0,
        success_flag: true,
      },
      {
        id: 'rec_013',
        date: new Date('2024-01-22T10:00:00Z'),
        pattern_type: 'C',
        response_time_hours: 2.9,
        success_flag: true,
      },
      {
        id: 'rec_014',
        date: new Date('2024-01-23T16:00:00Z'),
        pattern_type: 'C',
        response_time_hours: 3.1,
        success_flag: false,
      },
      {
        id: 'rec_015',
        date: new Date('2024-01-24T11:00:00Z'),
        pattern_type: 'C',
        response_time_hours: 3.0,
        success_flag: true,
      },
      // End of month: 3 records on last day
      {
        id: 'rec_016',
        date: new Date('2024-01-31T08:00:00Z'),
        pattern_type: 'B',
        response_time_hours: 6.0,
        success_flag: true,
      },
      {
        id: 'rec_017',
        date: new Date('2024-01-31T12:00:00Z'),
        pattern_type: 'C',
        response_time_hours: 3.0,
        success_flag: true,
      },
      {
        id: 'rec_018',
        date: new Date('2024-01-31T17:00:00Z'),
        pattern_type: 'C',
        response_time_hours: 2.9,
        success_flag: true,
      },
    ];

    const process_standards = [
      {
        pattern_type: 'A',
        standard_response_time_hours: 4.0,
        standard_success_rate: 0.85,
      },
      {
        pattern_type: 'B',
        standard_response_time_hours: 6.0,
        standard_success_rate: 0.9,
      },
      {
        pattern_type: 'C',
        standard_response_time_hours: 3.0,
        standard_success_rate: 0.75,
      },
    ];

    const result = analyzeCustomerInteractionPatternsWithProcessStandard({
      analysis_period_start: analysis_start_date,
      analysis_period_end: analysis_end_date,
      customer_interaction_records: customer_interaction_records,
      process_standards: process_standards,
    });

    // Total interaction count
    expect(result.total_interaction_count).toBe(18);

    // Pattern A: 5 records
    expect(result.pattern_breakdown[0].pattern_type).toBe('A');
    expect(result.pattern_breakdown[0].interaction_count).toBe(5);
    expect(result.pattern_breakdown[0].average_response_time_hours).toBeGreaterThanOrEqual(3.8);
    expect(result.pattern_breakdown[0].average_response_time_hours).toBeLessThanOrEqual(4.2);
    expect(result.pattern_breakdown[0].actual_success_rate).toBeGreaterThanOrEqual(0.84);
    expect(result.pattern_breakdown[0].actual_success_rate).toBeLessThanOrEqual(0.86);

    // Pattern B: 8 records
    expect(result.pattern_breakdown[1].pattern_type).toBe('B');
    expect(result.pattern_breakdown[1].interaction_count).toBe(8);
    expect(result.pattern_breakdown[1].average_response_time_hours).toBeGreaterThanOrEqual(5.7);
    expect(result.pattern_breakdown[1].average_response_time_hours).toBeLessThanOrEqual(6.3);
    expect(result.pattern_breakdown[1].actual_success_rate).toBeGreaterThanOrEqual(0.89);
    expect(result.pattern_breakdown[1].actual_success_rate).toBeLessThanOrEqual(0.91);

    // Pattern C: 5 records
    expect(result.pattern_breakdown[2].pattern_type).toBe('C');
    expect(result.pattern_breakdown[2].interaction_count).toBe(5);
    expect(result.pattern_breakdown[2].average_response_time_hours).toBeGreaterThanOrEqual(2.9);
    expect(result.pattern_breakdown[2].average_response_time_hours).toBeLessThanOrEqual(3.1);
    expect(result.pattern_breakdown[2].actual_success_rate).toBeGreaterThanOrEqual(0.74);
    expect(result.pattern_breakdown[2].actual_success_rate).toBeLessThanOrEqual(0.76);

    // Verify end-of-month records are included
    expect(result.analysis_period_start.getTime()).toBe(analysis_start_date.getTime());
    expect(result.analysis_period_end.getTime()).toBe(analysis_end_date.getTime());
    expect(result.records_included_in_analysis).toContainEqual(
      expect.objectContaining({
        id: 'rec_016',
        date: new Date('2024-01-31T08:00:00Z'),
      })
    );
    expect(result.records_included_in_analysis).toContainEqual(
      expect.objectContaining({
        id: 'rec_017',
        date: new Date('2024-01-31T12:00:00Z'),
      })
    );
    expect(result.records_included_in_analysis).toContainEqual(
      expect.objectContaining({
        id: 'rec_018',
        date: new Date('2024-01-31T17:00:00Z'),
      })
    );
  });
});