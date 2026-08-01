import { describe, test, expect } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-384
  test('商談実績データに営業案件IDが欠落しているとき、エラーが発生する', () => {
    const dealRecordsWithMissingDealId = [
      {
        recordId: 1,
        salesPersonId: 'SP001',
        dealId: 'DEAL001',
        contractAmount: 500000,
        contractDate: '2024-01-10',
        processStep: 'completed',
      },
      {
        recordId: 2,
        salesPersonId: 'SP001',
        dealId: 'DEAL002',
        contractAmount: 300000,
        contractDate: '2024-01-15',
        processStep: 'completed',
      },
      {
        recordId: 3,
        salesPersonId: 'SP002',
        dealId: 'DEAL003',
        contractAmount: 700000,
        contractDate: '2024-01-20',
        processStep: 'completed',
      },
      {
        recordId: 4,
        salesPersonId: 'SP002',
        dealId: 'DEAL004',
        contractAmount: 450000,
        contractDate: '2024-01-25',
        processStep: 'completed',
      },
      {
        recordId: 5,
        salesPersonId: 'SP003',
        dealId: 'DEAL005',
        contractAmount: 600000,
        contractDate: '2024-02-01',
        processStep: 'completed',
      },
      {
        recordId: 6,
        salesPersonId: 'SP003',
        dealId: 'DEAL006',
        contractAmount: 800000,
        contractDate: '2024-02-05',
        processStep: 'completed',
      },
      {
        recordId: 7,
        salesPersonId: 'SP001',
        dealId: null,
        contractAmount: 550000,
        contractDate: '2024-02-10',
        processStep: 'completed',
      },
    ];

    const analysisParams = {
      targetPeriodStart: '2024-01-01',
      targetPeriodEnd: '2024-02-28',
      dealRecords: dealRecordsWithMissingDealId,
    };

    expect(() => generateBehaviorPatternAnalysisReport(analysisParams)).toThrow(/営業案件ID/);
  });
});