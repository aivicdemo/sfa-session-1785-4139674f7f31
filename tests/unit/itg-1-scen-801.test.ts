import { calculateSalesPersonActionPatternAnalysis } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者行動パターン分析レポート生成機能', () => {
  // SCEN-801
  test('成約実績が0件のとき、分析結果に未測定フラグを付与する', () => {
    const salesPersonId = 'SP001';
    const analysisTargetPeriodStart = new Date('2024-01-01T00:00:00Z');
    const analysisTargetPeriodEnd = new Date('2024-01-31T23:59:59Z');

    const mockContractResults = [];

    const result = calculateSalesPersonActionPatternAnalysis({
      salesPersonId,
      analysisTargetPeriodStart,
      analysisTargetPeriodEnd,
      contractResults: mockContractResults,
    });

    expect(result.isUnmeasured).toBe(true);
    expect(result.impactOnContractResults).toBeNull();
    expect(result.errorOccurred).toBe(false);
  });
});