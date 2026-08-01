import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateSalesPersonMonthlyAggregation } from '../../src/logic/it-1-br-2-1-1-1';

const fetchMock = require('jest-fetch-mock');

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  // SCEN-202
  test('月初集計時に対象月の全営業行動データが集計対象に含まれること', async () => {
    const targetMonth = new Date('2024-01-01');
    const salesPersonId = 'SP001';

    const mockActivityRecords = [
      {
        activityId: 'ACT001',
        salesPersonId: salesPersonId,
        activityDate: '2024-01-01',
        activityType: 'visit',
        customerId: 'C001',
        duration: 30,
      },
      {
        activityId: 'ACT002',
        salesPersonId: salesPersonId,
        activityDate: '2024-01-05',
        activityType: 'proposal',
        customerId: 'C002',
        duration: 45,
      },
      {
        activityId: 'ACT003',
        salesPersonId: salesPersonId,
        activityDate: '2024-01-10',
        activityType: 'negotiation',
        customerId: 'C003',
        duration: 60,
      },
      {
        activityId: 'ACT004',
        salesPersonId: salesPersonId,
        activityDate: '2024-01-15',
        activityType: 'visit',
        customerId: 'C004',
        duration: 25,
      },
      {
        activityId: 'ACT005',
        salesPersonId: salesPersonId,
        activityDate: '2024-01-20',
        activityType: 'proposal',
        customerId: 'C005',
        duration: 50,
      },
      {
        activityId: 'ACT006',
        salesPersonId: salesPersonId,
        activityDate: '2024-01-31',
        activityType: 'visit',
        customerId: 'C006',
        duration: 35,
      },
    ];

    const expectedAggregationResult = {
      targetMonth: '2024-01',
      salesPersonId: salesPersonId,
      aggregationPeriodStart: '2024-01-01',
      aggregationPeriodEnd: '2024-01-31',
      totalActivityCount: 6,
      activitiesByType: {
        visit: 3,
        proposal: 2,
        negotiation: 1,
      },
      totalDuration: 245,
      includedActivityIds: [
        'ACT001',
        'ACT002',
        'ACT003',
        'ACT004',
        'ACT005',
        'ACT006',
      ],
      dataIntegrityVerified: true,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockActivityRecords), {
      status: 200,
    });

    const result = await calculateSalesPersonMonthlyAggregation({
      targetMonth: targetMonth,
      salesPersonId: salesPersonId,
    });

    expect(result.targetMonth).toBe('2024-01');
    expect(result.aggregationPeriodStart).toBe('2024-01-01');
    expect(result.aggregationPeriodEnd).toBe('2024-01-31');
    expect(result.totalActivityCount).toBe(6);
    expect(result.activitiesByType.visit).toBe(3);
    expect(result.activitiesByType.proposal).toBe(2);
    expect(result.activitiesByType.negotiation).toBe(1);
    expect(result.totalDuration).toBe(245);
    expect(result.includedActivityIds.length).toBe(6);
    expect(result.includedActivityIds).toEqual(
      expectedAggregationResult.includedActivityIds
    );
    expect(result.dataIntegrityVerified).toBe(true);
  });
});