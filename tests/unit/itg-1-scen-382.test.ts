import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-382
  test('行動パターンが時系列順に正しく抽出される', () => {
    const salesPersonId = 'SALES001';
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date('2024-01-31T23:59:59Z');

    const activityRecords = [
      {
        id: 'ACT001',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-02T09:00:00Z'),
        customerId: 'CUST001',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT002',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-03T10:30:00Z'),
        customerId: 'CUST002',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT003',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-04T14:15:00Z'),
        customerId: 'CUST003',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT004',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-05T11:00:00Z'),
        customerId: 'CUST001',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT005',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-06T09:30:00Z'),
        customerId: 'CUST002',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT006',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-07T15:45:00Z'),
        customerId: 'CUST003',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT007',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-08T10:00:00Z'),
        customerId: 'CUST001',
        description: 'Follow-up call',
      },
      {
        id: 'ACT008',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-09T13:20:00Z'),
        customerId: 'CUST002',
        description: 'Follow-up call',
      },
      {
        id: 'ACT009',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-10T11:40:00Z'),
        customerId: 'CUST003',
        description: 'Follow-up call',
      },
      {
        id: 'ACT010',
        salesPersonId,
        activityType: 'contract',
        occurredAt: new Date('2024-01-11T16:30:00Z'),
        customerId: 'CUST001',
        description: 'Contract signed',
      },
      {
        id: 'ACT011',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-12T08:45:00Z'),
        customerId: 'CUST004',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT012',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-13T12:15:00Z'),
        customerId: 'CUST005',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT013',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-14T09:50:00Z'),
        customerId: 'CUST004',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT014',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-15T14:25:00Z'),
        customerId: 'CUST005',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT015',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-16T10:35:00Z'),
        customerId: 'CUST004',
        description: 'Follow-up call',
      },
      {
        id: 'ACT016',
        salesPersonId,
        activityType: 'contract',
        occurredAt: new Date('2024-01-17T15:10:00Z'),
        customerId: 'CUST002',
        description: 'Contract signed',
      },
      {
        id: 'ACT017',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-18T09:05:00Z'),
        customerId: 'CUST006',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT018',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-19T11:30:00Z'),
        customerId: 'CUST006',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT019',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-20T13:45:00Z'),
        customerId: 'CUST005',
        description: 'Follow-up call',
      },
      {
        id: 'ACT020',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-21T10:20:00Z'),
        customerId: 'CUST006',
        description: 'Follow-up call',
      },
      {
        id: 'ACT021',
        salesPersonId,
        activityType: 'contract',
        occurredAt: new Date('2024-01-22T14:55:00Z'),
        customerId: 'CUST005',
        description: 'Contract signed',
      },
      {
        id: 'ACT022',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-23T08:30:00Z'),
        customerId: 'CUST007',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT023',
        salesPersonId,
        activityType: 'initial_contact',
        occurredAt: new Date('2024-01-24T12:00:00Z'),
        customerId: 'CUST008',
        description: 'Initial contact with customer',
      },
      {
        id: 'ACT024',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-25T10:15:00Z'),
        customerId: 'CUST007',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT025',
        salesPersonId,
        activityType: 'proposal',
        occurredAt: new Date('2024-01-26T15:40:00Z'),
        customerId: 'CUST008',
        description: 'Proposal presentation',
      },
      {
        id: 'ACT026',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-27T09:25:00Z'),
        customerId: 'CUST007',
        description: 'Follow-up call',
      },
      {
        id: 'ACT027',
        salesPersonId,
        activityType: 'contract',
        occurredAt: new Date('2024-01-28T16:05:00Z'),
        customerId: 'CUST003',
        description: 'Contract signed',
      },
      {
        id: 'ACT028',
        salesPersonId,
        activityType: 'follow_up',
        occurredAt: new Date('2024-01-29T11:50:00Z'),
        customerId: 'CUST008',
        description: 'Follow-up call',
      },
      {
        id: 'ACT029',
        salesPersonId,
        activityType: 'contract',
        occurredAt: new Date('2024-01-30T14:20:00Z'),
        customerId: 'CUST006',
        description: 'Contract signed',
      },
      {
        id: 'ACT030',
        salesPersonId,
        activityType: 'contract',
        occurredAt: new Date('2024-01-31T13:00:00Z'),
        customerId: 'CUST008',
        description: 'Contract signed',
      },
    ];

    const report = generateBehaviorPatternAnalysisReport(
      salesPersonId,
      startDate,
      endDate,
      activityRecords
    );

    expect(report.salesPersonId).toBe('SALES001');
    expect(report.periodStart).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(report.periodEnd).toEqual(new Date('2024-01-31T23:59:59Z'));
    expect(report.totalActivityCount).toBe(30);

    expect(report.behaviorPatterns.length).toBe(30);

    for (let i = 0; i < report.behaviorPatterns.length - 1; i++) {
      const currentTime = report.behaviorPatterns[i].occurredAt.getTime();
      const nextTime = report.behaviorPatterns[i + 1].occurredAt.getTime();
      expect(currentTime).toBeLessThanOrEqual(nextTime);
    }

    expect(report.behaviorPatterns[0].occurredAt).toEqual(
      new Date('2024-01-02T09:00:00Z')
    );
    expect(report.behaviorPatterns[0].activityType).toBe('initial_contact');

    expect(report.behaviorPatterns[9].occurredAt).toEqual(
      new Date('2024-01-11T16:30:00Z')
    );
    expect(report.behaviorPatterns[9].activityType).toBe('contract');

    expect(report.behaviorPatterns[29].occurredAt).toEqual(
      new Date('2024-01-31T13:00:00Z')
    );
    expect(report.behaviorPatterns[29].activityType).toBe('contract');

    const initialContactPatterns = report.behaviorPatterns.filter(
      (p) => p.activityType === 'initial_contact'
    );
    const proposalPatterns = report.behaviorPatterns.filter(
      (p) => p.activityType === 'proposal'
    );
    const followUpPatterns = report.behaviorPatterns.filter(
      (p) => p.activityType === 'follow_up'
    );
    const contractPatterns = report.behaviorPatterns.filter(
      (p) => p.activityType === 'contract'
    );

    expect(initialContactPatterns.length).toBe(9);
    expect(proposalPatterns.length).toBe(8);
    expect(followUpPatterns.length).toBe(7);
    expect(contractPatterns.length).toBe(6);

    const allIds = report.behaviorPatterns.map((p) => p.id);
    const expectedIds = activityRecords.map((a) => a.id);
    expect(allIds).toEqual(expectedIds);
  });
});