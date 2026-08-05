import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateSalesPersonBehaviorAnalysis } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  let mockDatabase: Map<string, unknown>;

  beforeEach(() => {
    mockDatabase = new Map();
  });

  afterEach(() => {
    mockDatabase.clear();
  });

  // SCEN-284
  test('月次モニタリング集計期間の開始日が null のとき、処理が中断される', () => {
    const monitoringPeriod = {
      startDate: null,
      endDate: new Date('2024-02-29T23:59:59Z'),
    };

    const salesPersonIds = ['SP001', 'SP002', 'SP003'];

    const result = calculateSalesPersonBehaviorAnalysis({
      monitoringPeriod,
      salesPersonIds,
      database: mockDatabase,
    });

    expect(result).toEqual({
      success: false,
      errorCode: 'INVALID_MONITORING_PERIOD_START_DATE',
      errorMessage: expect.stringContaining('INVALID_MONITORING_PERIOD_START_DATE'),
      aggregatedData: null,
    });

    expect(mockDatabase.size).toBe(0);
  });
});