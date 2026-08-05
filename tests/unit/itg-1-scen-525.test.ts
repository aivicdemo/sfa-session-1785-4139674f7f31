import { generateSalesPersonAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-525
  test('営業担当者ごとの行動パターン分析レポート生成機能 - 営業担当者の商談実績が0件の場合、成約率は0%として正確に計算される', () => {
    const salesPersonId = 'SP-001';
    const salesPersonName = '営業担当者A';
    const dealRecords = [];
    const analysisStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisEndDate = new Date('2024-01-31T23:59:59Z');

    const report = generateSalesPersonAnalysisReport({
      salesPersonId,
      salesPersonName,
      dealRecords,
      analysisStartDate,
      analysisEndDate,
    });

    expect(report).toEqual({
      salesPersonId: 'SP-001',
      salesPersonName: '営業担当者A',
      analysisStartDate: new Date('2024-01-01T00:00:00Z'),
      analysisEndDate: new Date('2024-01-31T23:59:59Z'),
      totalDeals: 0,
      closedDeals: 0,
      closingRate: 0,
      failedDeals: 0,
      failureRate: 0,
      averageContactFrequency: 0,
      averageFollowUpInterval: 0,
      successPatternMatches: 0,
      processComplianceRate: 0,
      calculationBasis: {
        closingRateFormula: '0 / 0',
        closingRateCalculation: 'No deals to calculate',
        failureRateFormula: '0 / 0',
        failureRateCalculation: 'No deals to calculate',
      },
      generatedAt: report.generatedAt,
    });

    expect(report.closingRate).toBe(0);
    expect(report.totalDeals).toBe(0);
    expect(report.closedDeals).toBe(0);
    expect(report.calculationBasis.closingRateFormula).toBe('0 / 0');
  });
});