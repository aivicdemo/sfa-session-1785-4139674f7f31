import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-628
  test('乖離度が±5%以内の場合、改善優先度が「低」に判定される', () => {
    const salesRepADeviation = 3;
    const salesRepBDeviation = -5;
    
    const mockDataWithDeviations = [
      {
        salesRepId: 'A001',
        salesRepName: '営業担当者A',
        deviationRate: salesRepADeviation,
        standardProcessCompliance: 97,
        closingRate: 0.65,
        followUpFrequency: 4.2,
        proposalAccuracyScore: 85
      },
      {
        salesRepId: 'B001',
        salesRepName: '営業担当者B',
        deviationRate: salesRepBDeviation,
        standardProcessCompliance: 95,
        closingRate: 0.62,
        followUpFrequency: 3.8,
        proposalAccuracyScore: 82
      }
    ];

    const report = generateBehaviorPatternAnalysisReport(mockDataWithDeviations);

    const salesRepAReport = report.find((item: any) => item.salesRepId === 'A001');
    const salesRepBReport = report.find((item: any) => item.salesRepId === 'B001');

    expect(salesRepAReport).toBeDefined();
    expect(salesRepBReport).toBeDefined();
    expect(salesRepAReport.improvementPriority).toBe('低');
    expect(salesRepBReport.improvementPriority).toBe('低');
  });
});