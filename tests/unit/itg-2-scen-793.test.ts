import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeOperationalProcessExecution } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-793
  test('分析対象期間が年をまたぐ場合、全期間の記録が正しく集計される', () => {
    const analysisStartDate = new Date('2023-11-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    const salesRecords = [
      {
        id: 'record_001',
        date: new Date('2023-11-15T09:00:00Z'),
        amount: 100000,
        customerId: 'cust_001',
      },
      {
        id: 'record_002',
        date: new Date('2023-12-10T10:30:00Z'),
        amount: 150000,
        customerId: 'cust_002',
      },
      {
        id: 'record_003',
        date: new Date('2023-12-20T14:00:00Z'),
        amount: 120000,
        customerId: 'cust_003',
      },
      {
        id: 'record_004',
        date: new Date('2024-01-05T11:15:00Z'),
        amount: 200000,
        customerId: 'cust_004',
      },
      {
        id: 'record_005',
        date: new Date('2024-01-15T13:45:00Z'),
        amount: 180000,
        customerId: 'cust_005',
      },
      {
        id: 'record_006',
        date: new Date('2024-01-25T16:20:00Z'),
        amount: 160000,
        customerId: 'cust_006',
      },
    ];

    const result = analyzeOperationalProcessExecution({
      startDate: analysisStartDate,
      endDate: analysisEndDate,
      records: salesRecords,
    });

    expect(result.totalRecordCount).toBe(6);
    expect(result.recordsByMonth).toEqual({
      '2023-11': 1,
      '2023-12': 2,
      '2024-01': 3,
    });
    expect(result.includedRecords).toHaveLength(6);
    expect(result.includedRecords.map((r) => r.id)).toEqual([
      'record_001',
      'record_002',
      'record_003',
      'record_004',
      'record_005',
      'record_006',
    ]);
  });
});