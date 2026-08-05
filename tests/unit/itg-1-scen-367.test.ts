import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateSystemHealthCheckReport } from '../../src/logic/it-1-br-2-1-1';

describe('System Health Check Report Generation - Same Day Period', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-367
  test('should generate health check report correctly when check period start and end date are the same day', () => {
    const check_start_date = new Date('2024-01-15T00:00:00Z');
    const check_end_date = new Date('2024-01-15T23:59:59Z');
    const target_date_str = '2024-01-15';

    const health_check_data = [
      {
        check_timestamp: new Date('2024-01-15T06:00:00Z'),
        cpu_usage_percent: 45.2,
        memory_usage_percent: 62.8,
        disk_usage_percent: 71.5,
        response_time_ms: 245,
        error_rate_percent: 0.8,
      },
      {
        check_timestamp: new Date('2024-01-15T12:00:00Z'),
        cpu_usage_percent: 58.9,
        memory_usage_percent: 75.3,
        disk_usage_percent: 72.1,
        response_time_ms: 312,
        error_rate_percent: 1.2,
      },
      {
        check_timestamp: new Date('2024-01-15T18:00:00Z'),
        cpu_usage_percent: 51.4,
        memory_usage_percent: 68.5,
        disk_usage_percent: 70.8,
        response_time_ms: 278,
        error_rate_percent: 0.9,
      },
      {
        check_timestamp: new Date('2024-01-16T02:00:00Z'),
        cpu_usage_percent: 42.1,
        memory_usage_percent: 55.2,
        disk_usage_percent: 69.3,
        response_time_ms: 201,
        error_rate_percent: 0.5,
      },
    ];

    const report = generateSystemHealthCheckReport({
      check_start_date,
      check_end_date,
      health_check_data,
    });

    expect(report.report_status_code).toBe(200);
    expect(report.report_status).toBe('completed');
    expect(report.check_period_start).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(report.check_period_end).toEqual(new Date('2024-01-15T23:59:59Z'));

    expect(report.data_point_count).toBe(3);
    expect(report.average_cpu_usage_percent).toBe(51.83);
    expect(report.average_memory_usage_percent).toBe(68.87);
    expect(report.average_disk_usage_percent).toBe(71.47);
    expect(report.average_response_time_ms).toBe(278.33);
    expect(report.average_error_rate_percent).toBe(0.97);

    expect(report.max_cpu_usage_percent).toBe(58.9);
    expect(report.max_memory_usage_percent).toBe(75.3);
    expect(report.max_disk_usage_percent).toBe(72.1);
    expect(report.max_response_time_ms).toBe(312);
    expect(report.max_error_rate_percent).toBe(1.2);

    expect(report.min_cpu_usage_percent).toBe(45.2);
    expect(report.min_memory_usage_percent).toBe(62.8);
    expect(report.min_disk_usage_percent).toBe(70.8);
    expect(report.min_response_time_ms).toBe(245);
    expect(report.min_error_rate_percent).toBe(0.8);

    expect(report.cpu_health_status).toBe('normal');
    expect(report.memory_health_status).toBe('normal');
    expect(report.disk_health_status).toBe('normal');
    expect(report.response_time_health_status).toBe('normal');
    expect(report.error_rate_health_status).toBe('normal');

    expect(report.has_error_message).toBe(false);
    expect(report.error_message).toBe('');

    expect(Array.isArray(report.included_data_points)).toBe(true);
    expect(report.included_data_points.length).toBe(3);
    report.included_data_points.forEach((dp) => {
      expect(dp.check_timestamp.getUTCDate()).toBe(15);
      expect(dp.check_timestamp.getUTCMonth()).toBe(0);
      expect(dp.check_timestamp.getUTCFullYear()).toBe(2024);
    });
  });
});