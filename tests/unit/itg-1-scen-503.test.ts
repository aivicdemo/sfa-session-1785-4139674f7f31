import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  generateSalesActivityAnalysisReport,
  type SalesActivityAnalysisReportInput,
  type SalesActivityAnalysisReport,
  type SalesActivityRecord,
} from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  let mockDb: Map<string, SalesActivityRecord[]>;
  let mockSalesPersonDb: Map<string, { id: string; name: string }>;

  beforeEach(() => {
    mockDb = new Map();
    mockSalesPersonDb = new Map();

    mockSalesPersonDb.set('TEST_SALES_001', {
      id: 'TEST_SALES_001',
      name: 'Test Sales Person',
    });

    const salesPersonId = 'TEST_SALES_001';
    const records: SalesActivityRecord[] = [
      {
        id: 'ACT_001',
        salesPersonId,
        customerId: 'CUST_A',
        activityType: 'meeting',
        outcome: 'deal_created',
        executedAt: new Date('2024-01-31T23:59:58Z'),
        description: 'Customer A - Business Discussion',
      },
      {
        id: 'ACT_002',
        salesPersonId,
        customerId: 'CUST_B',
        activityType: 'proposal',
        outcome: 'proposal_submitted',
        executedAt: new Date('2024-01-31T23:59:59Z'),
        description: 'Customer B - Quote Submission',
      },
      {
        id: 'ACT_003',
        salesPersonId,
        customerId: 'CUST_C',
        activityType: 'visit',
        outcome: 'relationship_building',
        executedAt: new Date('2024-02-01T00:00:00Z'),
        description: 'Customer C - First Visit',
      },
    ];

    mockDb.set(salesPersonId, records);
  });

  afterEach(() => {
    mockDb.clear();
    mockSalesPersonDb.clear();
  });

  // SCEN-503
  test('[edge] 営業担当者ごとの行動パターン分析レポート生成機能 - 月末日の23時59分59秒で正しく集計される', () => {
    const input: SalesActivityAnalysisReportInput = {
      salesPersonId: 'TEST_SALES_001',
      analysisStartDate: new Date('2024-01-01T00:00:00Z'),
      analysisEndDate: new Date('2024-01-31T23:59:59Z'),
    };

    const report = generateSalesActivityAnalysisReport(
      input,
      mockDb,
      mockSalesPersonDb
    );

    expect(report).toBeDefined();
    expect(report.salesPersonId).toBe('TEST_SALES_001');
    expect(report.analysisStartDate).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(report.analysisEndDate).toEqual(new Date('2024-01-31T23:59:59Z'));

    expect(report.meetingCount).toBe(1);
    expect(report.proposalCount).toBe(1);
    expect(report.visitCount).toBe(0);
    expect(report.totalActivityCount).toBe(2);

    expect(report.dealsCreated).toBe(1);
    expect(report.proposalsSubmitted).toBe(1);
    expect(report.relationshipsBuilt).toBe(0);

    expect(report.includedActivityIds).toContain('ACT_001');
    expect(report.includedActivityIds).toContain('ACT_002');
    expect(report.includedActivityIds).not.toContain('ACT_003');
    expect(report.includedActivityIds.length).toBe(2);

    const activityDetails = report.activityDetails;
    expect(activityDetails).toBeDefined();
    expect(activityDetails.length).toBe(2);

    const meetingActivity = activityDetails.find(
      (a) => a.id === 'ACT_001'
    );
    expect(meetingActivity).toBeDefined();
    expect(meetingActivity?.activityType).toBe('meeting');
    expect(meetingActivity?.executedAt).toEqual(
      new Date('2024-01-31T23:59:58Z')
    );
    expect(meetingActivity?.outcome).toBe('deal_created');

    const proposalActivity = activityDetails.find(
      (a) => a.id === 'ACT_002'
    );
    expect(proposalActivity).toBeDefined();
    expect(proposalActivity?.activityType).toBe('proposal');
    expect(proposalActivity?.executedAt).toEqual(
      new Date('2024-01-31T23:59:59Z')
    );
    expect(proposalActivity?.outcome).toBe('proposal_submitted');
  });
});