import { generateSalesPatternAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-524: [normal] 営業担当者ごとの行動パターン分析レポート生成機能
  test('複数営業担当者の商談実績データと行動ログから正確な成功パターン・失敗パターン・成約率を抽出', () => {
    const salesRepresentativeA = {
      salesRepresentativeId: 'rep-a',
      name: '担当者A',
    };
    const salesRepresentativeB = {
      salesRepresentativeId: 'rep-b',
      name: '担当者B',
    };
    const salesRepresentativeC = {
      salesRepresentativeId: 'rep-c',
      name: '担当者C',
    };

    const dealDataA = [
      {
        dealId: 'deal-a-1',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A1',
        status: 'won',
        closedDate: '2024-01-15T09:00:00Z',
        dealAmount: 500000,
      },
      {
        dealId: 'deal-a-2',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A2',
        status: 'won',
        closedDate: '2024-01-20T10:00:00Z',
        dealAmount: 450000,
      },
      {
        dealId: 'deal-a-3',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A3',
        status: 'won',
        closedDate: '2024-02-05T11:00:00Z',
        dealAmount: 600000,
      },
      {
        dealId: 'deal-a-4',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A4',
        status: 'won',
        closedDate: '2024-02-10T14:00:00Z',
        dealAmount: 400000,
      },
      {
        dealId: 'deal-a-5',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A5',
        status: 'won',
        closedDate: '2024-02-15T15:00:00Z',
        dealAmount: 550000,
      },
      {
        dealId: 'deal-a-6',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A6',
        status: 'lost',
        closedDate: '2024-01-25T12:00:00Z',
        dealAmount: 300000,
      },
      {
        dealId: 'deal-a-7',
        salesRepresentativeId: 'rep-a',
        dealName: '案件A7',
        status: 'lost',
        closedDate: '2024-02-20T13:00:00Z',
        dealAmount: 350000,
      },
    ];

    const dealDataB = [
      {
        dealId: 'deal-b-1',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B1',
        status: 'won',
        closedDate: '2024-01-10T09:00:00Z',
        dealAmount: 400000,
      },
      {
        dealId: 'deal-b-2',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B2',
        status: 'won',
        closedDate: '2024-01-28T10:00:00Z',
        dealAmount: 500000,
      },
      {
        dealId: 'deal-b-3',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B3',
        status: 'won',
        closedDate: '2024-02-08T11:00:00Z',
        dealAmount: 480000,
      },
      {
        dealId: 'deal-b-4',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B4',
        status: 'lost',
        closedDate: '2024-01-18T12:00:00Z',
        dealAmount: 250000,
      },
      {
        dealId: 'deal-b-5',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B5',
        status: 'lost',
        closedDate: '2024-02-03T13:00:00Z',
        dealAmount: 300000,
      },
      {
        dealId: 'deal-b-6',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B6',
        status: 'lost',
        closedDate: '2024-02-12T14:00:00Z',
        dealAmount: 280000,
      },
      {
        dealId: 'deal-b-7',
        salesRepresentativeId: 'rep-b',
        dealName: '案件B7',
        status: 'lost',
        closedDate: '2024-02-18T15:00:00Z',
        dealAmount: 320000,
      },
    ];

    const dealDataC = [
      {
        dealId: 'deal-c-1',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C1',
        status: 'won',
        closedDate: '2024-01-12T09:00:00Z',
        dealAmount: 600000,
      },
      {
        dealId: 'deal-c-2',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C2',
        status: 'won',
        closedDate: '2024-01-22T10:00:00Z',
        dealAmount: 550000,
      },
      {
        dealId: 'deal-c-3',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C3',
        status: 'won',
        closedDate: '2024-02-02T11:00:00Z',
        dealAmount: 700000,
      },
      {
        dealId: 'deal-c-4',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C4',
        status: 'won',
        closedDate: '2024-02-11T14:00:00Z',
        dealAmount: 650000,
      },
      {
        dealId: 'deal-c-5',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C5',
        status: 'won',
        closedDate: '2024-02-14T15:00:00Z',
        dealAmount: 720000,
      },
      {
        dealId: 'deal-c-6',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C6',
        status: 'won',
        closedDate: '2024-02-21T16:00:00Z',
        dealAmount: 680000,
      },
      {
        dealId: 'deal-c-7',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C7',
        status: 'won',
        closedDate: '2024-02-25T17:00:00Z',
        dealAmount: 620000,
      },
      {
        dealId: 'deal-c-8',
        salesRepresentativeId: 'rep-c',
        dealName: '案件C8',
        status: 'lost',
        closedDate: '2024-02-01T12:00:00Z',
        dealAmount: 400000,
      },
    ];

    const activityLogA = [
      {
        activityLogId: 'log-a-1',
        salesRepresentativeId: 'rep-a',
        activityType: 'visit',
        timestamp: '2024-01-10T09:00:00Z',
        customerId: 'cust-1',
      },
      {
        activityLogId: 'log-a-2',
        salesRepresentativeId: 'rep-a',
        activityType: 'proposal_sent',
        timestamp: '2024-01-11T10:00:00Z',
        customerId: 'cust-1',
      },
      {
        activityLogId: 'log-a-3',
        salesRepresentativeId: 'rep-a',
        activityType: 'email',
        timestamp: '2024-01-12T11:00:00Z',
        customerId: 'cust-1',
      },
      {
        activityLogId: 'log-a-4',
        salesRepresentativeId: 'rep-a',
        activityType: 'visit',
        timestamp: '2024-01-13T12:00:00Z',
        customerId: 'cust-1',
      },
      {
        activityLogId: 'log-a-5',
        salesRepresentativeId: 'rep-a',
        activityType: 'visit',
        timestamp: '2024-01-18T09:00:00Z',
        customerId: 'cust-2',
      },
      {
        activityLogId: 'log-a-6',
        salesRepresentativeId: 'rep-a',
        activityType: 'proposal_sent',
        timestamp: '2024-01-19T10:00:00Z',
        customerId: 'cust-2',
      },
      {
        activityLogId: 'log-a-7',
        salesRepresentativeId: 'rep-a',
        activityType: 'email',
        timestamp: '2024-01-20T11:00:00Z',
        customerId: 'cust-2',
      },
    ];

    const activityLogB = [
      {
        activityLogId: 'log-b-1',
        salesRepresentativeId: 'rep-b',
        activityType: 'visit',
        timestamp: '2024-01-08T09:00:00Z',
        customerId: 'cust-3',
      },
      {
        activityLogId: 'log-b-2',
        salesRepresentativeId: 'rep-b',
        activityType: 'email',
        timestamp: '2024-01-09T10:00:00Z',
        customerId: 'cust-3',
      },
      {
        activityLogId: 'log-b-3',
        salesRepresentativeId: 'rep-b',
        activityType: 'proposal_sent',
        timestamp: '2024-01-09T14:00:00Z',
        customerId: 'cust-3',
      },
      {
        activityLogId: 'log-b-4',
        salesRepresentativeId: 'rep-b',
        activityType: 'visit',
        timestamp: '2024-01-26T09:00:00Z',
        customerId: 'cust-4',
      },
      {
        activityLogId: 'log-b-5',
        salesRepresentativeId: 'rep-b',
        activityType: 'email',
        timestamp: '2024-01-27T10:00:00Z',
        customerId: 'cust-4',
      },
      {
        activityLogId: 'log-b-6',
        salesRepresentativeId: 'rep-b',
        activityType: 'email',
        timestamp: '2024-01-28T11:00:00Z',
        customerId: 'cust-4',
      },
    ];

    const activityLogC = [
      {
        activityLogId: 'log-c-1',
        salesRepresentativeId: 'rep-c',
        activityType: 'visit',
        timestamp: '2024-01-10T09:00:00Z',
        customerId: 'cust-5',
      },
      {
        activityLogId: 'log-c-2',
        salesRepresentativeId: 'rep-c',
        activityType: 'proposal_sent',
        timestamp: '2024-01-10T14:00:00Z',
        customerId: 'cust-5',
      },
      {
        activityLogId: 'log-c-3',
        salesRepresentativeId: 'rep-c',
        activityType: 'visit',
        timestamp: '2024-01-20T09:00:00Z',
        customerId: 'cust-6',
      },
      {
        activityLogId: 'log-c-4',
        salesRepresentativeId: 'rep-c',
        activityType: 'proposal_sent',
        timestamp: '2024-01-20T14:00:00Z',
        customerId: 'cust-6',
      },
      {
        activityLogId: 'log-c-5',
        salesRepresentativeId: 'rep-c',
        activityType: 'visit',
        timestamp: '2024-01-31T09:00:00Z',
        customerId: 'cust-7',
      },
      {
        activityLogId: 'log-c-6',
        salesRepresentativeId: 'rep-c',
        activityType: 'proposal_sent',
        timestamp: '2024-01-31T14:00:00Z',
        customerId: 'cust-7',
      },
    ];

    const allDeals = [...dealDataA, ...dealDataB, ...dealDataC];
    const allActivityLogs = [...activityLogA, ...activityLogB, ...activityLogC];

    const analysisRequest = {
      salesRepresentatives: [
        salesRepresentativeA,
        salesRepresentativeB,
        salesRepresentativeC,
      ],
      deals: allDeals,
      activityLogs: allActivityLogs,
      analysisStartDate: '2024-01-01T00:00:00Z',
      analysisEndDate: '2024-02-29T23:59:59Z',
    };

    const report = generateSalesPatternAnalysisReport(analysisRequest);

    expect(report).toBeDefined();
    expect(report.reportId).toBeDefined();
    expect(report.generatedAt).toBeDefined();
    expect(report.analysisRepresentatives).toHaveLength(3);

    const repAAnalysis = report.analysisRepresentatives.find(
      (rep) => rep.salesRepresentativeId === 'rep-a'
    );
    expect(repAAnalysis).toBeDefined();
    expect(repAAnalysis?.successCount).toBe(5);
    expect(repAAnalysis?.failureCount).toBe(2);
    expect(repAAnalysis?.winRate).toBe(71.4);
    expect(repAAnalysis?.successPatterns).toBeDefined();
    expect(repAAnalysis?.successPatterns.length).toBeGreaterThan(0);
    expect(repAAnalysis?.failurePatterns).toBeDefined();
    expect(repAAnalysis?.failurePatterns.length).toBeGreaterThan(0);

    const repBAnalysis = report.analysisRepresentatives.find(
      (rep) => rep.salesRepresentativeId === 'rep-b'
    );
    expect(repBAnalysis).toBeDefined();
    expect(repBAnalysis?.successCount).toBe(3);
    expect(repBAnalysis?.failureCount).toBe(4);
    expect(repBAnalysis?.winRate).toBe(42.9);
    expect(repBAnalysis?.successPatterns).toBeDefined();
    expect(repBAnalysis?.successPatterns.length).toBeGreaterThan(0);
    expect(repBAnalysis?.failurePatterns).toBeDefined();
    expect(repBAnalysis?.failurePatterns.length).toBeGreaterThan(0);

    const repCAnalysis = report.analysisRepresentatives.find(
      (rep) => rep.salesRepresentativeId === 'rep-c'
    );
    expect(repCAnalysis).toBeDefined();
    expect(repCAnalysis?.successCount).toBe(7);
    expect(repCAnalysis?.failureCount).toBe(1);
    expect(repCAnalysis?.winRate).toBe(87.5);
    expect(repCAnalysis?.successPatterns).toBeDefined();
    expect(repCAnalysis?.successPatterns.length).toBeGreaterThan(0);
    expect(repCAnalysis?.failurePatterns).toBeDefined();
    expect(repCAnalysis?.failurePatterns.length).toBeGreaterThan(0);

    const successPatternIds = new Set<string>();
    const failurePatternIds = new Set<string>();
    report.analysisRepresentatives.forEach((rep) => {
      rep.successPatterns.forEach((pattern) => {
        expect(successPatternIds.has(pattern.patternId)).toBe(false);
        successPatternIds.add(pattern.patternId);
      });
      rep.failurePatterns.forEach((pattern) => {
        expect(failurePatternIds.has(pattern.patternId)).toBe(false);
        failurePatternIds.add(pattern.patternId);
      });
    });

    expect(report.totalDealsAnalyzed).toBe(15);
    expect(report.totalSuccessfulDeals).toBe(15);
    expect(report.totalFailedDeals).toBe(7);
  });
});