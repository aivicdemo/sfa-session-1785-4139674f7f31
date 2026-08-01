import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-321: 営業案件が複数件の営業担当者について乖離度が正常に計算される', async () => {
    const salesPersonId = 'sales_person_A';
    const targetPeriodStart = '2024-01-01';
    const targetPeriodEnd = '2024-01-31';

    const salesProjectData = [
      {
        projectId: 'proj_001',
        salesPersonId: salesPersonId,
        targetAmount: 1000000,
        actualAmount: 950000,
        closedDate: '2024-01-15',
      },
      {
        projectId: 'proj_002',
        salesPersonId: salesPersonId,
        targetAmount: 800000,
        actualAmount: 880000,
        closedDate: '2024-01-20',
      },
      {
        projectId: 'proj_003',
        salesPersonId: salesPersonId,
        targetAmount: 1200000,
        actualAmount: 1050000,
        closedDate: '2024-01-25',
      },
    ];

    const report = await generateSalesPersonActionPatternReport({
      salesPersonId,
      targetPeriodStart,
      targetPeriodEnd,
      projectData: salesProjectData,
    });

    const proj1Deviation = ((950000 - 1000000) / 1000000) * 100;
    const proj2Deviation = ((880000 - 800000) / 800000) * 100;
    const proj3Deviation = ((1050000 - 1200000) / 1200000) * 100;
    const averageDeviation = (proj1Deviation + proj2Deviation + proj3Deviation) / 3;

    expect(report).toEqual({
      salesPersonId: salesPersonId,
      targetPeriodStart: targetPeriodStart,
      targetPeriodEnd: targetPeriodEnd,
      projectCount: 3,
      projectDeviations: [
        { projectId: 'proj_001', deviationRate: -5.0 },
        { projectId: 'proj_002', deviationRate: 10.0 },
        { projectId: 'proj_003', deviationRate: -12.5 },
      ],
      averageDeviationRate: -2.5,
      generatedAt: expect.any(String),
    });

    expect(report.projectDeviations[0].deviationRate).toBe(-5.0);
    expect(report.projectDeviations[1].deviationRate).toBe(10.0);
    expect(report.projectDeviations[2].deviationRate).toBe(-12.5);
    expect(report.averageDeviationRate).toBe(-2.5);
  });
});