import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-633
  test('乖離度が±15%直下（例：+14.9%）の場合、改善優先度が「中」に判定される', () => {
    const input = {
      salesPersonId: 'SP-001',
      salesPersonName: '営業太郎',
      behaviorPatternData: {
        initialContactFrequency: 8,
        proposalSuccessRate: 0.68,
        followUpInterval: 5.2,
        standardInitialContactFrequency: 10,
        standardProposalSuccessRate: 0.8,
        standardFollowUpInterval: 4.5,
      },
      periodStart: '2024-01-01',
      periodEnd: '2024-01-31',
    };

    const deviationPercentage = ((8 - 10) / 10) * 100 + ((0.68 - 0.8) / 0.8) * 100 + ((5.2 - 4.5) / 4.5) * 100;
    const averageDeviation = deviationPercentage / 3;

    const report = generateSalesPersonBehaviorAnalysisReport(input);

    expect(report.salesPersonId).toBe('SP-001');
    expect(report.salesPersonName).toBe('営業太郎');
    expect(report.improvementPriority).toBe('中');
    expect(report.deviationPercentage).toBeCloseTo(14.9, 0);
    expect(report.periodStart).toBe('2024-01-01');
    expect(report.periodEnd).toBe('2024-01-31');
  });
});