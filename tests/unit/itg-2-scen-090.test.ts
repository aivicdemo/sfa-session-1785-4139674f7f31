import { describe, test, expect } from '@jest/globals';
import { validateSalesData } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-090
  test('検証対象のデータ品質ルールが0件の場合、検証をスキップする', () => {
    const salesData = {
      customerName: '株式会社ABC',
      amount: 500000,
      transactionDate: '2024-01-15'
    };

    const qualityRules: any[] = [];

    const result = validateSalesData(salesData, qualityRules);

    expect(result).toEqual({
      skipped: true,
      rulesCount: 0,
      validationErrors: []
    });
  });
});