import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-338
  test('期間が月をまたぐ場合、すべての月のデータが正常に集計される', () => {
    const employeeId = 'EMP001';
    const startDate = new Date('2024-11-15T00:00:00Z');
    const endDate = new Date('2024-12-20T23:59:59Z');

    const activityData = [
      // 11月のデータ
      { employeeId, activityType: 'visit', date: new Date('2024-11-15T10:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-16T11:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-17T12:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-18T13:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-19T14:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-20T15:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-21T16:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-22T17:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-23T18:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-24T19:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-25T20:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-26T21:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-27T22:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-28T23:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-11-29T08:00:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-15T10:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-16T11:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-18T13:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-19T14:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-22T17:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-25T20:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-27T22:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-11-29T08:30:00Z') },
      // 12月のデータ
      { employeeId, activityType: 'visit', date: new Date('2024-12-01T09:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-02T10:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-03T11:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-05T13:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-08T14:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-10T15:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-12T16:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-15T17:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-17T18:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-19T19:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-20T20:00:00Z') },
      { employeeId, activityType: 'visit', date: new Date('2024-12-21T21:00:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-12-02T10:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-12-05T13:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-12-08T14:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-12-12T16:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-12-17T18:30:00Z') },
      { employeeId, activityType: 'proposal', date: new Date('2024-12-20T20:30:00Z') },
    ];

    const report = generateBehaviorPatternAnalysisReport({
      employeeId,
      startDate,
      endDate,
      activityData,
    });

    expect(report.employeeId).toBe('EMP001');
    expect(report.reportPeriodStart).toEqual(startDate);
    expect(report.reportPeriodEnd).toEqual(endDate);
    expect(report.totalVisits).toBe(27);
    expect(report.totalProposals).toBe(14);
    expect(report.novemberVisits).toBe(15);
    expect(report.novemberProposals).toBe(8);
    expect(report.decemberVisits).toBe(12);
    expect(report.decemberProposals).toBe(6);
  });
});