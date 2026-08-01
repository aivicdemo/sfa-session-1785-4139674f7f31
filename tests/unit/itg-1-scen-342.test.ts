import { describe, test, expect } from '@jest/globals';
import { generateSalesActivityPatternReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-342
  test('営業活動の成約率に小数点以下の値が含まれる場合、正常に丸められる', () => {
    const input = {
      salesPersonId: 'SP001',
      salesPersonName: '営業太郎',
      totalContacts: 7,
      closedDeals: 3,
      analysisPeriodStart: '2024-01-01',
      analysisPeriodEnd: '2024-01-31',
    };

    const result = generateSalesActivityPatternReport(input);

    const expectedConversionRate = 0.43;
    expect(result.conversionRate).toBe(expectedConversionRate);
  });
});