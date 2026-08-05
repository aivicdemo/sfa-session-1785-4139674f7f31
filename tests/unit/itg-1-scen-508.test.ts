import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-508
  test('1000件を超える営業活動ログが正しく分析される', async () => {
    const salesperson_id = 'SALES-001';
    const analysis_start_date = new Date('2024-10-15T00:00:00Z');
    const analysis_end_date = new Date('2025-01-13T23:59:59Z');
    const memory_before = process.memoryUsage().heapUsed;

    const mock_activity_logs = [];
    const activity_types = ['visit', 'call', 'email', 'proposal'];
    const time_slots = [
      { hour: 8, label: 'morning' },
      { hour: 14, label: 'afternoon' },
      { hour: 19, label: 'evening' }
    ];

    for (let i = 0; i < 1050; i++) {
      const activity_type = activity_types[i % activity_types.length];
      const time_slot = time_slots[Math.floor(i / activity_types.length) % time_slots.length];
      const log_date = new Date(
        analysis_start_date.getTime() +
        Math.random() * (analysis_end_date.getTime() - analysis_start_date.getTime())
      );
      log_date.setHours(time_slot.hour, Math.floor(Math.random() * 60), 0, 0);

      const is_converted = i % 7 === 0;

      mock_activity_logs.push({
        activity_id: `ACT-${String(i).padStart(6, '0')}`,
        salesperson_id: salesperson_id,
        activity_type: activity_type,
        activity_timestamp: log_date.toISOString(),
        converted: is_converted,
        customer_id: `CUST-${String(Math.floor(i / 4)).padStart(5, '0')}`
      });
    }

    const start_time = Date.now();

    const report = await generateSalesActivityPatternReport({
      salesperson_id: salesperson_id,
      analysis_start_date: analysis_start_date,
      analysis_end_date: analysis_end_date,
      activity_logs: mock_activity_logs
    });

    const end_time = Date.now();
    const processing_time_seconds = (end_time - start_time) / 1000;
    const memory_after = process.memoryUsage().heapUsed;
    const memory_increase_percent = ((memory_after - memory_before) / memory_before) * 100;

    expect(report.total_logs_analyzed).toBe(1050);

    expect(report.activity_breakdown.visit).toBe(263);
    expect(report.activity_breakdown.call).toBe(263);
    expect(report.activity_breakdown.email).toBe(262);
    expect(report.activity_breakdown.proposal).toBe(262);

    const morning_count = report.time_distribution.morning;
    const afternoon_count = report.time_distribution.afternoon;
    const evening_count = report.time_distribution.evening;

    expect(morning_count + afternoon_count + evening_count).toBe(1050);

    const conversion_rate = (report.conversion_count / report.total_logs_analyzed) * 100;
    expect(conversion_rate).toBeCloseTo(14.29, 1);
    expect(report.conversion_rate_percent).toBeCloseTo(14.29, 1);

    expect(processing_time_seconds).toBeLessThan(3);
    expect(memory_increase_percent).toBeLessThan(10);
  });
});