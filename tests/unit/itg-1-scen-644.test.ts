import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-644
  test('分析対象期間が月をまたぐとき、両月のデータが正確に集計される', () => {
    const salesPersonId = 'A001';
    const startDate = new Date('2024-03-25T00:00:00Z');
    const endDate = new Date('2024-04-05T23:59:59Z');

    const marchContractData = [
      {
        contractDate: new Date('2024-03-25T10:00:00Z'),
        amount: 300000,
        status: 'completed',
      },
      {
        contractDate: new Date('2024-03-26T14:30:00Z'),
        amount: 400000,
        status: 'completed',
      },
      {
        contractDate: new Date('2024-03-27T09:15:00Z'),
        amount: 250000,
        status: 'completed',
      },
      {
        contractDate: new Date('2024-03-29T16:45:00Z'),
        amount: 350000,
        status: 'completed',
      },
      {
        contractDate: new Date('2024-03-31T11:20:00Z'),
        amount: 350000,
        status: 'completed',
      },
    ];

    const aprilContractData = [
      {
        contractDate: new Date('2024-04-01T08:00:00Z'),
        amount: 400000,
        status: 'completed',
      },
      {
        contractDate: new Date('2024-04-03T13:30:00Z'),
        amount: 250000,
        status: 'completed',
      },
      {
        contractDate: new Date('2024-04-05T10:45:00Z'),
        amount: 400000,
        status: 'completed',
      },
    ];

    const allContractData = [...marchContractData, ...aprilContractData];

    const report = analyzeAndGenerateReport({
      salesPersonId: salesPersonId,
      startDate: startDate,
      endDate: endDate,
      contractData: allContractData,
    });

    expect(report.aggregationPeriod).toBe('2024年3月25日～2024年4月5日');
    expect(report.totalContractCount).toBe(8);
    expect(report.totalRevenueAmount).toBe(2400000);

    expect(report.monthlyBreakdown).toEqual({
      '2024-03': {
        contractCount: 5,
        revenueAmount: 1500000,
        monthDisplay: '3月',
      },
      '2024-04': {
        contractCount: 3,
        revenueAmount: 1050000,
        monthDisplay: '4月',
      },
    });

    expect(report.reportGeneratedAt).toBeDefined();
    expect(typeof report.reportGeneratedAt).toBe('string');
  });
});