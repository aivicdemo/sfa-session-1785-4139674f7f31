import { describe, test, expect } from '@jest/globals';
import { generateSalesPersonActivityPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-357
  test('成約率が100%ちょうどのとき、数値が正確に計算される', () => {
    const salesPersonId = 'SP-001';
    const contractedCount = 10;
    const lostCount = 0;
    const totalDeals = contractedCount + lostCount;
    const expectedConversionRate = 100.00;

    const report = generateSalesPersonActivityPatternAnalysisReport({
      salesPersonId,
      contractedCount,
      lostCount,
    });

    expect(report).toBeDefined();
    expect(report.conversionRate).toBe(expectedConversionRate);
    expect(report.totalDeals).toBe(totalDeals);
    expect(report.contractedCount).toBe(contractedCount);
    expect(report.lostCount).toBe(lostCount);
  });
});