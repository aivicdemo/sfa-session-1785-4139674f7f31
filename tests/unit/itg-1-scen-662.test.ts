import { calculateAnomalyPatternVisibility } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-662: AIエージェント推論による異常パターン検出と可視化 - 異常パターンが行動分析レポートに正しく可視化される', () => {
    const mockAnomalyDetectionResult = {
      salesRepAId: 'sales_rep_001',
      salesRepAName: '営業担当者A',
      salesRepAAnomalies: [
        {
          anomalyType: 'revenue_submission_concentration',
          anomalyDescription: '売上提出日が月末に集中する傾向',
          severityLevel: 'high',
          anomalyReason: 'Revenue submission is concentrated on month-end dates',
        },
      ],
      salesRepBId: 'sales_rep_002',
      salesRepBName: '営業担当者B',
      salesRepBAnomalies: [
        {
          anomalyType: 'proposal_conversion_rate_divergence',
          anomalyDescription: '提案数と成約率に乖離がある',
          severityLevel: 'medium',
          proposalCount: 24,
          conversionRate: 0.25,
          anomalyReason:
            'Significant divergence between proposal count and conversion rate',
        },
      ],
      salesRepCId: 'sales_rep_003',
      salesRepCName: '営業担当者C',
      salesRepCAnomalies: [
        {
          anomalyType: 'visit_frequency_seasonality_absence',
          anomalyDescription: '訪問頻度の季節性がない',
          severityLevel: 'low',
          visualizationType: 'chart',
          anomalyReason: 'No seasonal pattern detected in visit frequency',
        },
      ],
    };

    const reportData = calculateAnomalyPatternVisibility(
      mockAnomalyDetectionResult
    );

    // Validate Anomaly Pattern A: Text description visibility
    expect(reportData.salesRepAReport.anomalyPatterns).toBeDefined();
    expect(reportData.salesRepAReport.anomalyPatterns.length).toBe(1);
    expect(reportData.salesRepAReport.anomalyPatterns[0]).toEqual({
      displayFormat: 'text',
      anomalyDescription: '売上提出日が月末に集中する傾向',
      severityLabel: '高',
      severityLevel: 'high',
    });

    // Validate Anomaly Pattern B: Table with numeric values
    expect(reportData.salesRepBReport.anomalyPatterns).toBeDefined();
    expect(reportData.salesRepBReport.anomalyPatterns.length).toBe(1);
    expect(reportData.salesRepBReport.anomalyPatterns[0]).toEqual({
      displayFormat: 'table',
      anomalyDescription: '提案数と成約率に乖離がある',
      proposalCountValue: 24,
      conversionRateValue: 0.25,
      severityLabel: '中',
      severityLevel: 'medium',
    });

    // Validate Anomaly Pattern C: Visual element (chart)
    expect(reportData.salesRepCReport.anomalyPatterns).toBeDefined();
    expect(reportData.salesRepCReport.anomalyPatterns.length).toBe(1);
    expect(reportData.salesRepCReport.anomalyPatterns[0]).toEqual({
      displayFormat: 'chart',
      anomalyDescription: '訪問頻度の季節性がない',
      chartType: 'line',
      severityLabel: '低',
      severityLevel: 'low',
    });

    // Validate complete report structure
    expect(reportData.reportGeneratedAt).toBeDefined();
    expect(reportData.reportGeneratedAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
    expect(reportData.totalAnomaliesDetected).toBe(3);
  });
});