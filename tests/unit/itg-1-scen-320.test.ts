import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  test('SCEN-320: 営業案件が1件の営業担当者について乖離度が正常に計算される', () => {
    const salesPersonId = 'SALES-001';
    const dealId = 'DEAL-0001';
    const contractAmount = 1000000;
    const stageName = '提案';
    const dealCount = 1;
    const conversionRate = null;
    const industryStandardDealCount = 5;
    const industryStandardConversionRate = 0.4;

    const input = {
      salesPersonId,
      dealId,
      contractAmount,
      stageName,
      dealCount,
      conversionRate,
      industryStandardDealCount,
      industryStandardConversionRate,
    };

    const result = generateSalesPersonAnalysisReport(input);

    expect(result.deviationScore).toBe(82.5);
    expect(result.reportDetails.calculationMethod).toBe('StandardDeviation_1item');
    expect(typeof result.deviationScore).toBe('number');
    expect(typeof result.reportDetails.calculationMethod).toBe('string');
  });
});