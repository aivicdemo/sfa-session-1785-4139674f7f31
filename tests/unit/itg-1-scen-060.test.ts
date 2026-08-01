import { describe, test, expect } from '@jest/globals';
import { confirmExtractionScope } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-060
  test('対象営業担当者が0人のとき抽出範囲が空で確定される', () => {
    const extractionScope = confirmExtractionScope({
      selectedSalesPersonIds: [],
      extractionStartDate: '2024-01-01T00:00:00Z',
      extractionEndDate: '2024-01-31T23:59:59Z',
    });

    expect(extractionScope.salesPersonIds).toEqual([]);
    expect(extractionScope.salesPersonIds.length).toBe(0);
    expect(extractionScope.startDate).toBe('2024-01-01T00:00:00Z');
    expect(extractionScope.endDate).toBe('2024-01-31T23:59:59Z');
  });
});