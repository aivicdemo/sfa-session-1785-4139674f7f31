import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-622
  test('[edge] チーム平均成約率が1名の場合、その値とチーム平均が一致する', () => {
    const mockSalesPersonId = 'SP001';
    const mockTeamId = 'TEAM001';

    const mockInput = {
      teamId: mockTeamId,
      salesPersons: [
        {
          id: mockSalesPersonId,
          name: '営業太郎',
          teamId: mockTeamId,
        },
      ],
      dealResults: [
        {
          id: 'DEAL001',
          salesPersonId: mockSalesPersonId,
          status: 'won' as const,
          closedAt: '2024-01-10T10:00:00Z',
        },
        {
          id: 'DEAL002',
          salesPersonId: mockSalesPersonId,
          status: 'won' as const,
          closedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: 'DEAL003',
          salesPersonId: mockSalesPersonId,
          status: 'won' as const,
          closedAt: '2024-01-20T10:00:00Z',
        },
        {
          id: 'DEAL004',
          salesPersonId: mockSalesPersonId,
          status: 'lost' as const,
          closedAt: '2024-01-25T10:00:00Z',
        },
        {
          id: 'DEAL005',
          salesPersonId: mockSalesPersonId,
          status: 'lost' as const,
          closedAt: '2024-01-30T10:00:00Z',
        },
      ],
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    };

    const report = generateBehaviorPatternAnalysisReport(mockInput);

    expect(report.teamAverageClosingRate).toBe(60.0);
    expect(report.salesPersonMetrics).toHaveLength(1);
    expect(report.salesPersonMetrics[0].id).toBe(mockSalesPersonId);
    expect(report.salesPersonMetrics[0].individualClosingRate).toBe(60.0);
    expect(report.teamAverageClosingRate).toBe(
      report.salesPersonMetrics[0].individualClosingRate
    );
  });
});