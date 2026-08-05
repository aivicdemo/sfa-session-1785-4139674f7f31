import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import { generateSystemHealthCheckReport } from '../../src/logic/it-1-br-2-1-1';

describe('System Health Check Report Generation - Month Start Inclusion', () => {
  beforeEach(() => {
    fetchMock.enableMocks();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.disableMocks();
  });

  // SCEN-369
  test('should generate report with accurate aggregation when check period includes month start date', async () => {
    const check_period_start = new Date('2024-01-01T00:00:00Z');
    const check_period_end = new Date('2024-01-15T23:59:59Z');
    const report_generated_at = new Date('2024-01-15T10:00:00Z');

    const health_check_data_jan_01 = {
      check_date: '2024-01-01',
      system_status: 'healthy',
      uptime_percentage: 99.8,
      check_items_total: 15,
      check_items_passed: 15,
      check_items_failed: 0,
      response_time_ms: 245,
    };

    const health_check_data_jan_05 = {
      check_date: '2024-01-05',
      system_status: 'healthy',
      uptime_percentage: 99.5,
      check_items_total: 15,
      check_items_passed: 14,
      check_items_failed: 1,
      response_time_ms: 312,
    };

    const health_check_data_jan_15 = {
      check_date: '2024-01-15',
      system_status: 'healthy',
      uptime_percentage: 99.9,
      check_items_total: 15,
      check_items_passed: 15,
      check_items_failed: 0,
      response_time_ms: 198,
    };

    fetchMock.mockResponses(
      [JSON.stringify({ data: [health_check_data_jan_01] }), { status: 200 }],
      [JSON.stringify({ data: [health_check_data_jan_05] }), { status: 200 }],
      [JSON.stringify({ data: [health_check_data_jan_15] }), { status: 200 }]
    );

    const report = await generateSystemHealthCheckReport({
      check_period_start,
      check_period_end,
      report_generated_at,
    });

    expect(report.period_start_date).toBe('2024-01-01');
    expect(report.period_end_date).toBe('2024-01-15');

    expect(report.period_formatted).toBe('2024年1月1日～2024年1月15日');

    expect(report.total_check_count).toBe(3);
    expect(report.total_check_items).toBe(45);
    expect(report.total_items_passed).toBe(44);
    expect(report.total_items_failed).toBe(1);

    const avg_passed_rate = (44 / 45) * 100;
    expect(Math.abs(report.average_pass_rate - avg_passed_rate)).toBeLessThan(0.01);

    const included_dates = report.check_results.map((r: any) => r.check_date);
    expect(included_dates).toContain('2024-01-01');
    expect(included_dates).toContain('2024-01-05');
    expect(included_dates).toContain('2024-01-15');

    const jan_01_result = report.check_results.find((r: any) => r.check_date === '2024-01-01');
    expect(jan_01_result).toBeDefined();
    expect(jan_01_result?.items_passed).toBe(15);
    expect(jan_01_result?.items_failed).toBe(0);
    expect(jan_01_result?.uptime_percentage).toBe(99.8);

    expect(report.report_generated_at).toBe('2024-01-15T10:00:00Z');
  });
});