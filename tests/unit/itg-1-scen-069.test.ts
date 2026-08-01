import { describe, it, expect, beforeEach } from '@jest/globals';
import { determineSalesProcessLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-069
  it('[normal] 抽出対象期間の終了日が月末でないとき指定日が確定される', () => {
    const extraction_start_date = new Date('2024-01-01T00:00:00Z');
    const extraction_end_date = new Date('2024-01-15T00:00:00Z');

    const result = determineSalesProcessLogExtractionRange({
      extraction_start_date,
      extraction_end_date,
    });

    expect(result.confirmed_end_date).toEqual(new Date('2024-01-15T00:00:00Z'));
  });
});