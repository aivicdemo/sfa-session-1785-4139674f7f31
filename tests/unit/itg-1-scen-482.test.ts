import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-482
  test('営業担当者の営業活動ログの電話件数が分析される', () => {
    const salesPersonName = '田中太郎';
    const completedPhoneCalls = 12;
    const incompletePhoneCalls = 3;
    const totalPhoneCalls = completedPhoneCalls + incompletePhoneCalls;

    const activityLogs = [
      {
        id: 'log_001',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-15T09:30:00Z'
      },
      {
        id: 'log_002',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-15T10:45:00Z'
      },
      {
        id: 'log_003',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-15T14:20:00Z'
      },
      {
        id: 'log_004',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-16T08:15:00Z'
      },
      {
        id: 'log_005',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-16T11:00:00Z'
      },
      {
        id: 'log_006',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-17T09:00:00Z'
      },
      {
        id: 'log_007',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-17T13:30:00Z'
      },
      {
        id: 'log_008',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-18T10:00:00Z'
      },
      {
        id: 'log_009',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-19T15:00:00Z'
      },
      {
        id: 'log_010',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-20T09:30:00Z'
      },
      {
        id: 'log_011',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-21T11:00:00Z'
      },
      {
        id: 'log_012',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'completed',
        recordedDate: '2024-11-22T14:00:00Z'
      },
      {
        id: 'log_013',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'incomplete',
        recordedDate: '2024-11-23T10:00:00Z'
      },
      {
        id: 'log_014',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'incomplete',
        recordedDate: '2024-11-24T14:30:00Z'
      },
      {
        id: 'log_015',
        salesPersonName: salesPersonName,
        activityType: 'phone',
        status: 'incomplete',
        recordedDate: '2024-11-25T16:00:00Z'
      }
    ];

    const reportInput = {
      salesPersonName: salesPersonName,
      activityLogs: activityLogs,
      analysisStartDate: '2024-10-27T00:00:00Z',
      analysisEndDate: '2024-11-26T23:59:59Z'
    };

    const generatedReport = generateSalesActivityPatternAnalysisReport(reportInput);

    expect(generatedReport).toBeDefined();
    expect(generatedReport.salesPersonName).toBe(salesPersonName);
    expect(generatedReport.phoneCallMetrics).toBeDefined();
    expect(generatedReport.phoneCallMetrics.totalPhoneCalls).toBe(totalPhoneCalls);
    expect(generatedReport.phoneCallMetrics.completedPhoneCalls).toBe(completedPhoneCalls);
    expect(generatedReport.phoneCallMetrics.incompletePhoneCalls).toBe(incompletePhoneCalls);
  });
});