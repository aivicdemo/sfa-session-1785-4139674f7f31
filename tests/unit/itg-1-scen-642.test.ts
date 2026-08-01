import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateBehaviorPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-642
  test('フォローアップ記録が過去3ヶ月分0件の場合、フォローアップ成功率が計算不可となる', () => {
    const analysisInput = {
      salesRepId: 'SALESREP_A',
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-03-31',
      analysisPeriodMonths: 3,
      followUpRecords: [],
      proposalRecords: [
        {
          proposalId: 'PROP_001',
          salesRepId: 'SALESREP_A',
          customerId: 'CUST_001',
          proposalDate: '2024-02-15',
          proposalStatus: 'submitted',
        },
      ],
      dealRecords: [
        {
          dealId: 'DEAL_001',
          salesRepId: 'SALESREP_A',
          customerId: 'CUST_001',
          dealStatus: 'closed_won',
          closedDate: '2024-03-20',
        },
      ],
    };

    const report = generateBehaviorPatternReport(analysisInput);

    expect(report).toBeDefined();
    expect(report.reportStatus).toBe('completed');
    expect(report.followUpSuccessRate).toBe('N/A');
    expect(report.followUpRecordCount).toBe(0);
    expect(report.systemErrorOccurred).toBe(false);
    expect(report.analysisValid).toBe(true);
  });
});