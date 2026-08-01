import { calculateDeviationDegree } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析機能', () => {
  // SCEN-818
  test('分析対象期間内に営業活動ログが存在しない月がある場合、その月の乖離度を0%として計算に含める', () => {
    const sales_rep_id = 'SR001';
    const analysis_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_end_date = new Date('2024-03-31T23:59:59Z');

    const activity_logs = [
      {
        log_id: 'LOG001',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-10T09:00:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG002',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-15T14:00:00Z'),
        activity_type: 'call',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG003',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-20T10:30:00Z'),
        activity_type: 'email',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG004',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-25T11:00:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG005',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-28T15:30:00Z'),
        activity_type: 'call',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG006',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-30T09:15:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG007',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-31T13:45:00Z'),
        activity_type: 'email',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG008',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-22T10:00:00Z'),
        activity_type: 'call',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG009',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-05T16:00:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG010',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-01-12T11:30:00Z'),
        activity_type: 'email',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG011',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-05T09:00:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG012',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-10T14:00:00Z'),
        activity_type: 'call',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG013',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-15T10:30:00Z'),
        activity_type: 'email',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG014',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-20T11:00:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG015',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-25T15:30:00Z'),
        activity_type: 'call',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG016',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-28T09:15:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG017',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-30T13:45:00Z'),
        activity_type: 'email',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG018',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-22T10:00:00Z'),
        activity_type: 'call',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG019',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-08T16:00:00Z'),
        activity_type: 'visit',
        deviation_from_standard_process: 0,
      },
      {
        log_id: 'LOG020',
        sales_rep_id: sales_rep_id,
        activity_date: new Date('2024-03-12T11:30:00Z'),
        activity_type: 'email',
        deviation_from_standard_process: 0,
      },
    ];

    const analysis_result = calculateDeviationDegree(
      sales_rep_id,
      analysis_start_date,
      analysis_end_date,
      activity_logs
    );

    expect(analysis_result.monthly_deviation_degrees).toEqual({
      '2024-01': 0,
      '2024-02': 0,
      '2024-03': 0,
    });

    expect(analysis_result.average_deviation_degree_percentage).toBe(0);
  });
});