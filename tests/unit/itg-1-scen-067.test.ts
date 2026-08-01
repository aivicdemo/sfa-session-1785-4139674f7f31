import { describe, test, expect } from '@jest/globals';
import { determineSalesProcessLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-067
  test('抽出対象期間の開始日が月初でないとき指定日が確定される', () => {
    const startDate = new Date('2024-01-15T00:00:00Z');
    const endDate = new Date('2024-01-31T23:59:59Z');

    const result = determineSalesProcessLogExtractionRange({
      startDate,
      endDate,
    });

    expect(result.confirmedStartDate).toEqual(new Date('2024-01-15T00:00:00Z'));
    expect(result.confirmedEndDate).toEqual(new Date('2024-01-31T23:59:59Z'));
  });
});