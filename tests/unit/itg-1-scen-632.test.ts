import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-632
  test('乖離度が+15.1%の場合、改善優先度が「高」に判定される', () => {
    const salesPersonId = 'SP001';
    const analysisMonth = '2024-01-01';
    const expectedBehaviorPattern = {
      initialContactFrequency: 10,
      proposalSuccessRate: 0.75,
      followUpInterval: 3,
      customerTouchCount: 20,
    };
    const actualBehaviorPattern = {
      initialContactFrequency: 11.51,
      proposalSuccessRate: 0.75,
      followUpInterval: 3,
      customerTouchCount: 20,
    };
    const deviationRatePercent = 15.1;

    const report = generateBehaviorPatternAnalysisReport({
      salesPersonId,
      analysisMonth,
      expectedBehaviorPattern,
      actualBehaviorPattern,
      deviationRatePercent,
    });

    expect(report.improvementPriority).toBe('高');
    expect(report.deviationRatePercent).toBe(15.1);
    expect(report.salesPersonId).toBe(salesPersonId);
  });
});