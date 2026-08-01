import { generateSalesRepActionPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-644
  test('複数指標の総合的な改善優先度が、最も優先度が高い指標に統一される', () => {
    const salesRepId = 'rep_001';
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-03-31T23:59:59Z');

    const actionPatternData = {
      salesRepId: salesRepId,
      analysisStartDate: analysisStartDate,
      analysisEndDate: analysisEndDate,
      actionMetrics: [
        {
          metricName: '提案成功率',
          metricValue: 65,
          priorityScore: 65,
        },
        {
          metricName: '初回接触率',
          metricValue: 72,
          priorityScore: 72,
        },
        {
          metricName: 'フォローアップ実施率',
          metricValue: 58,
          priorityScore: 58,
        },
      ],
      maxPriorityScore: 72,
    };

    const report = generateSalesRepActionPatternReport(actionPatternData);

    expect(report).toBeDefined();
    expect(report.salesRepId).toBe('rep_001');
    expect(report.overallImprovementPriority).toBe('初回接触率');
    expect(report.priorityScore).toBe(72);
    expect(report.analysisStartDate).toEqual(analysisStartDate);
    expect(report.analysisEndDate).toEqual(analysisEndDate);
    expect(report.actionMetrics).toHaveLength(3);
    expect(report.actionMetrics[1].metricName).toBe('初回接触率');
    expect(report.actionMetrics[1].priorityScore).toBe(72);
  });
});