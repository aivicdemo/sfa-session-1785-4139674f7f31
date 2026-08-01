import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1';

describe('行動パターン分析対象指標の自動選定機能', () => {
  // SCEN-763
  test('分析期間が月をまたぐ場合、両月のデータが正しく集計される', () => {
    const analysisStartDate = new Date('2024-01-15T00:00:00Z');
    const analysisEndDate = new Date('2024-02-10T23:59:59Z');
    const salesPersonId = 'A';

    const januaryActivities = [
      {
        activityId: 'act-jan-001',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-15T10:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-002',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-16T14:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-003',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-18T09:15:00Z'),
        activityType: 'visit',
        contractResult: true,
      },
      {
        activityId: 'act-jan-004',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-20T11:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-005',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-22T15:45:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-006',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-23T13:20:00Z'),
        activityType: 'visit',
        contractResult: true,
      },
      {
        activityId: 'act-jan-007',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-25T10:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-008',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-26T16:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-009',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-27T12:45:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-010',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-29T14:15:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-011',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-30T11:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-012',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-31T09:00:00Z'),
        activityType: 'visit',
        contractResult: true,
      },
      {
        activityId: 'act-jan-013',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-31T15:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-014',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-17T10:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-015',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-19T14:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-016',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-24T13:45:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-jan-017',
        salesPersonId: 'A',
        activityDate: new Date('2024-01-28T10:15:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
    ];

    const februaryActivities = [
      {
        activityId: 'act-feb-001',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-01T10:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-002',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-02T14:00:00Z'),
        activityType: 'visit',
        contractResult: true,
      },
      {
        activityId: 'act-feb-003',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-03T11:15:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-004',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-05T15:45:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-005',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-06T09:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-006',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-07T13:20:00Z'),
        activityType: 'visit',
        contractResult: true,
      },
      {
        activityId: 'act-feb-007',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-08T10:45:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-008',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-09T14:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-009',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-10T12:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-010',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-04T16:30:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-011',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-01T15:00:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
      {
        activityId: 'act-feb-012',
        salesPersonId: 'A',
        activityDate: new Date('2024-02-02T10:15:00Z'),
        activityType: 'visit',
        contractResult: false,
      },
    ];

    const allActivities = [...januaryActivities, ...februaryActivities];

    const result = selectAnalysisIndicators({
      analysisStartDate,
      analysisEndDate,
      salesPersonId,
      activities: allActivities,
    });

    expect(result.visitCount).toBe(29);
    expect(result.contractCount).toBe(5);
    expect(result.januaryVisitCount).toBe(17);
    expect(result.januaryContractCount).toBe(3);
    expect(result.februaryVisitCount).toBe(12);
    expect(result.februaryContractCount).toBe(2);
  });
});