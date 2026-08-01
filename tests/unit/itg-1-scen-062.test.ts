import { describe, test, expect } from '@jest/globals';
import { confirmExtractSalesProcessLogRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-062
  test('対象営業担当者が複数人のとき全員が抽出範囲に含まれる', () => {
    const targetSalesPersonIds = ['SP001', 'SP002', 'SP003'];
    const extractStartDate = '2024-01-01';
    const extractEndDate = '2024-01-31';

    const result = confirmExtractSalesProcessLogRange({
      targetSalesPersonIds,
      extractStartDate,
      extractEndDate,
    });

    expect(result.confirmedSalesPersonIds).toEqual(['SP001', 'SP002', 'SP003']);
    expect(result.confirmedSalesPersonIds.length).toBe(3);
    expect(result.extractPeriodStart).toBe('2024-01-01');
    expect(result.extractPeriodEnd).toBe('2024-01-31');
    expect(result.isConfirmed).toBe(true);
  });
});