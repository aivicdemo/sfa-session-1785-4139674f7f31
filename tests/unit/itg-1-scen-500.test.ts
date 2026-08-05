import { analyzeActionPatternDeviationAndGenerateReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-500
  test('標準プロセスからの乖離度が閾値ちょうど±5%に該当する場合に改善優先度が中と判定される', () => {
    // ケース1: 乖離度 -5%（実績95日、標準100日）
    const salesPersonIdA = 'SALES_A001';
    const standardProcessDays = 100;
    const actualCompletionDaysNegative = 95;
    const deviationPercentageNegative = ((actualCompletionDaysNegative - standardProcessDays) / standardProcessDays) * 100;

    const reportNegativeDeviation = analyzeActionPatternDeviationAndGenerateReport({
      salesPersonId: salesPersonIdA,
      standardProcessDurationDays: standardProcessDays,
      actualCompletionDurationDays: actualCompletionDaysNegative,
      contactFrequency: 8,
      proposalSuccessRate: 0.65,
      followUpIntervalDays: 3,
      contractAmount: 500000,
      successPatternMatch: 0.72,
    });

    expect(reportNegativeDeviation).toBeDefined();
    expect(reportNegativeDeviation.salesPersonId).toBe(salesPersonIdA);
    expect(reportNegativeDeviation.deviationPercentage).toBe(-5);
    expect(reportNegativeDeviation.priorityLevel).toBe('MEDIUM');

    // ケース2: 乖離度 +5%（実績105日、標準100日）
    const actualCompletionDaysPositive = 105;
    const deviationPercentagePositive = ((actualCompletionDaysPositive - standardProcessDays) / standardProcessDays) * 100;

    const reportPositiveDeviation = analyzeActionPatternDeviationAndGenerateReport({
      salesPersonId: salesPersonIdA,
      standardProcessDurationDays: standardProcessDays,
      actualCompletionDurationDays: actualCompletionDaysPositive,
      contactFrequency: 8,
      proposalSuccessRate: 0.65,
      followUpIntervalDays: 3,
      contractAmount: 500000,
      successPatternMatch: 0.72,
    });

    expect(reportPositiveDeviation).toBeDefined();
    expect(reportPositiveDeviation.salesPersonId).toBe(salesPersonIdA);
    expect(reportPositiveDeviation.deviationPercentage).toBe(5);
    expect(reportPositiveDeviation.priorityLevel).toBe('MEDIUM');
  });
});