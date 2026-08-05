import { generateMonthlyProcessAuditReport } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  test('SCEN-593: 月次レポート生成時に分析期間が正確に月初1日00:00:00から月末末日23:59:59までの場合', () => {
    const analysis_period_start_date = new Date('2024-01-01T00:00:00Z');
    const analysis_period_end_date = new Date('2024-01-31T23:59:59Z');

    const report = generateMonthlyProcessAuditReport({
      analysis_period_start: analysis_period_start_date,
      analysis_period_end: analysis_period_end_date,
    });

    const expected_start_timestamp = 1704067200000;
    const expected_end_timestamp = 1706745599999;

    expect(report.analysis_period_start_timestamp).toBe(expected_start_timestamp);
    expect(report.analysis_period_end_timestamp).toBe(expected_end_timestamp);
    expect(report.execution_records.every(
      (record: { timestamp: number }) =>
        record.timestamp >= expected_start_timestamp &&
        record.timestamp <= expected_end_timestamp
    )).toBe(true);
  });
});