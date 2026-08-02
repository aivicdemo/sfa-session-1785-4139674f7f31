import { validateSalesDataQuality } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-610
  test('品質検証結果レポートに検証実行日時が記載される', () => {
    const mockCurrentTime = new Date('2024-01-15T14:30:45Z');
    jest.useFakeTimers();
    jest.setSystemTime(mockCurrentTime);

    const mockSalesData = {
      records: [
        {
          customerId: 'CUST001',
          customerName: '株式会社ABC',
          email: 'contact@abc-corp.jp',
          phone: '090-1234-5678',
          industry: '製造業',
          status: 'active',
        },
      ],
    };

    const result = validateSalesDataQuality(mockSalesData);

    expect(result).toBeDefined();
    expect(result.reportGeneratedDateTime).toBe('2024-01-15T14:30:45');

    jest.useRealTimers();
  });
});