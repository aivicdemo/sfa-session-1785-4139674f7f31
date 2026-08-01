import { generateSalesPersonBehaviorAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-630
  test('乖離度が±5%直下（例：+4.9%）の場合、改善優先度が「低」に判定される', () => {
    const input = {
      salesPersonId: 'SP001',
      deviationRate: 4.9,
      processStepCount: 4,
      successRate: 0.75,
      contactFrequency: 2.5,
      followUpIntervalDays: 3,
      proposalAccuracyScore: 82,
      analysisMonthStart: new Date('2024-01-01'),
      analysisMonthEnd: new Date('2024-01-31'),
    };

    const result = generateSalesPersonBehaviorAnalysisReport(input);

    expect(result.improvementPriority).toBe('LOW');
  });
});