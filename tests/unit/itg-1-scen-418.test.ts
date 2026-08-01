import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-418
  test('営業担当者の分析データが複数件の場合、全件の平均値がレポートに反映される', () => {
    const salesPersonId = 'SP-001';
    const analysisData = [
      {
        salesPersonId,
        visitCount: 10,
        proposalCount: 5,
        followUpCount: 3,
        conversionRate: 0.4,
        recordedAt: '2024-01-01T09:00:00Z'
      },
      {
        salesPersonId,
        visitCount: 12,
        proposalCount: 6,
        followUpCount: 4,
        conversionRate: 0.5,
        recordedAt: '2024-01-08T09:00:00Z'
      },
      {
        salesPersonId,
        visitCount: 14,
        proposalCount: 7,
        followUpCount: 5,
        conversionRate: 0.6,
        recordedAt: '2024-01-15T09:00:00Z'
      }
    ];

    const report = generateBehaviorPatternAnalysisReport(analysisData, salesPersonId);

    expect(report.averageVisitCount).toBe(12);
    expect(report.averageProposalCount).toBe(6);
    expect(report.averageFollowUpCount).toBe(4);
    expect(report.averageConversionRate).toBe(0.5);
    expect(report.totalRecords).toBe(3);
    expect(report.salesPersonId).toBe(salesPersonId);
  });
});