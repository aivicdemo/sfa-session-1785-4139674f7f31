import { describe, test, expect } from '@jest/globals';
import { determineSalesProcessLogExtractionRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-099
  test('[error] 抽出対象期間の終了日が null のときエラーになる', () => {
    const start_date = new Date('2024-01-01T00:00:00Z');
    const end_date = null;

    expect(() =>
      determineSalesProcessLogExtractionRange({
        start_date,
        end_date,
      })
    ).toThrow(/抽出対象期間の終了日/);
  });
});