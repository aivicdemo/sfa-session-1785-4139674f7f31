import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-253: [edge] 標準プロセス遵守度スコア計算機能 - 年度をまたいだ期間で商談記録を集計するとき正しく計算される
  test('年度をまたいだ期間で複数年度の商談記録を正しく集計して遵守度スコアを計算する', () => {
    const companyId = 'company-001';
    const startDate = new Date('2023-10-01T00:00:00Z');
    const endDate = new Date('2024-03-31T23:59:59Z');

    // 2023年10月1日～2023年12月31日の商談記録（5件）
    const fy2023Records = [
      {
        dealId: 'deal-001',
        companyId,
        recordedDate: new Date('2023-10-10T09:00:00Z'),
        status: 'completed',
        processStageCompliance: 0.95,
      },
      {
        dealId: 'deal-002',
        companyId,
        recordedDate: new Date('2023-10-25T14:30:00Z'),
        status: 'completed',
        processStageCompliance: 0.88,
      },
      {
        dealId: 'deal-003',
        companyId,
        recordedDate: new Date('2023-11-15T10:00:00Z'),
        status: 'completed',
        processStageCompliance: 0.92,
      },
      {
        dealId: 'deal-004',
        companyId,
        recordedDate: new Date('2023-11-30T15:45:00Z'),
        status: 'in_progress',
        processStageCompliance: 0.75,
      },
      {
        dealId: 'deal-005',
        companyId,
        recordedDate: new Date('2023-12-20T11:20:00Z'),
        status: 'in_progress',
        processStageCompliance: 0.70,
      },
    ];

    // 2024年1月1日～2024年3月31日の商談記録（7件）
    const fy2024Records = [
      {
        dealId: 'deal-006',
        companyId,
        recordedDate: new Date('2024-01-08T09:30:00Z'),
        status: 'completed',
        processStageCompliance: 0.91,
      },
      {
        dealId: 'deal-007',
        companyId,
        recordedDate: new Date('2024-01-22T13:15:00Z'),
        status: 'completed',
        processStageCompliance: 0.87,
      },
      {
        dealId: 'deal-008',
        companyId,
        recordedDate: new Date('2024-02-05T10:45:00Z'),
        status: 'completed',
        processStageCompliance: 0.93,
      },
      {
        dealId: 'deal-009',
        companyId,
        recordedDate: new Date('2024-02-18T14:20:00Z'),
        status: 'completed',
        processStageCompliance: 0.89,
      },
      {
        dealId: 'deal-010',
        companyId,
        recordedDate: new Date('2024-03-01T11:00:00Z'),
        status: 'completed',
        processStageCompliance: 0.90,
      },
      {
        dealId: 'deal-011',
        companyId,
        recordedDate: new Date('2024-03-15T16:30:00Z'),
        status: 'in_progress',
        processStageCompliance: 0.72,
      },
      {
        dealId: 'deal-012',
        companyId,
        recordedDate: new Date('2024-03-28T12:10:00Z'),
        status: 'in_progress',
        processStageCompliance: 0.68,
      },
    ];

    const allRecords = [...fy2023Records, ...fy2024Records];

    const result = calculateProcessComplianceScore({
      companyId,
      startDate,
      endDate,
      dealRecords: allRecords,
    });

    // 期待値：完了商談8件 / 総商談12件 = 66.67%
    const expectedComplianceRate = (8 / 12) * 100;

    expect(result.complianceScore).toBeCloseTo(expectedComplianceRate, 1);
    expect(result.totalDealsAnalyzed).toBe(12);
    expect(result.completedDeals).toBe(8);
    expect(result.inProgressDeals).toBe(4);
    expect(result.periodStartDate).toEqual(startDate);
    expect(result.periodEndDate).toEqual(endDate);
  });
});