import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { analyzeManagerReportPerformance } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-906
  test('営業管理職による報告実績が確認できないとき、エラーが発生する', () => {
    const target_period_start = '2024-01-01';
    const target_period_end = '2024-01-31';
    const manager_id = 'MGR001';
    const report_records = [];

    expect(() => {
      analyzeManagerReportPerformance({
        period_start: target_period_start,
        period_end: target_period_end,
        manager_id: manager_id,
        report_data: report_records,
      });
    }).toThrow(/報告実績/);
  });
});