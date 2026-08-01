import { describe, test, expect, beforeEach } from '@jest/globals';
import { analyzeSalesPatternAndPerformance } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-452
  test('顧客対応記録に重複データが含まれる場合、重複を排除した上で分析される', () => {
    const salesRepId = 'tanaka_taro_001';
    const salesRepName = '田中太郎';
    const customerId = 'abc_corp_001';
    const customerName = 'ABC株式会社';

    const contactRecords = [
      {
        id: 'contact_001',
        salesRepId: salesRepId,
        customerId: customerId,
        customerName: customerName,
        contactDate: '2024-01-15',
        contactType: '電話',
        contactDurationMinutes: 15,
        outcome: 'no_conversion',
      },
      {
        id: 'contact_002',
        salesRepId: salesRepId,
        customerId: customerId,
        customerName: customerName,
        contactDate: '2024-01-15',
        contactType: '電話',
        contactDurationMinutes: 15,
        outcome: 'no_conversion',
      },
      {
        id: 'contact_003',
        salesRepId: salesRepId,
        customerId: customerId,
        customerName: customerName,
        contactDate: '2024-01-15',
        contactType: '電話',
        contactDurationMinutes: 15,
        outcome: 'no_conversion',
      },
    ];

    const analysisResult = analyzeSalesPatternAndPerformance({
      salesRepId: salesRepId,
      salesRepName: salesRepName,
      contactRecords: contactRecords,
      analysisStartDate: '2024-01-01',
      analysisEndDate: '2024-01-31',
    });

    expect(analysisResult).toBeDefined();
    expect(analysisResult.salesRepName).toBe('田中太郎');

    const abcCropRecord = analysisResult.customerContactSummary.find(
      (summary) => summary.customerId === customerId
    );

    expect(abcCropRecord).toBeDefined();
    expect(abcCropRecord?.contactCount).toBe(2);
    expect(abcCropRecord?.totalContactDurationMinutes).toBe(30);
    expect(abcCropRecord?.contactTypeBreakdown['電話']).toBe(2);

    const conversionRate =
      abcCropRecord?.conversionCount === 0 ? 0 : (abcCropRecord?.conversionCount ?? 0) / 2;
    expect(conversionRate).toBe(0);

    expect(analysisResult.totalUniqueContactCount).toBe(2);
    expect(analysisResult.totalContactDurationMinutes).toBe(30);
  });
});