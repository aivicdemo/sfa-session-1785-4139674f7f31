import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateInferenceAccuracyReport } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-321
  test('AIエージェント推論ログが0件の場合に監視レポートが生成される', async () => {
    const report_start_date = '2024-01-01';
    const report_end_date = '2024-01-31';
    const monitoring_target = 'AIエージェント推論';
    const current_timestamp = new Date('2024-02-01T12:00:00Z');

    fetchMock.mockResponseOnce(
      JSON.stringify({
        inference_logs: [],
        total_count: 0,
      }),
      { status: 200 }
    );

    const result = await calculateInferenceAccuracyReport(
      {
        report_start_date,
        report_end_date,
        monitoring_target,
      },
      current_timestamp
    );

    expect(result.report_status).toBe('completed');
    expect(result.inference_log_count).toBe(0);
    expect(result.monitoring_period_start).toBe('2024-01-01');
    expect(result.monitoring_period_end).toBe('2024-01-31');
    expect(new Date(result.report_generated_timestamp).getTime()).toBeGreaterThanOrEqual(
      current_timestamp.getTime() - 60000
    );
    expect(new Date(result.report_generated_timestamp).getTime()).toBeLessThanOrEqual(
      current_timestamp.getTime() + 60000
    );
    expect(result.accuracy_statistics).toEqual([]);
  });
});