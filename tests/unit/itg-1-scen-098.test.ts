import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateExtractionDateRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログ抽出範囲確定機能', () => {
  // SCEN-098: [error] 営業プロセスログ抽出範囲確定機能 - 抽出対象期間の開始日が null のときエラーになる
  test('抽出対象期間の開始日が null の場合、INVALID_START_DATE エラーが発生する', () => {
    const start_date = null;
    const end_date = '2024-12-31';

    expect(() => {
      validateExtractionDateRange({
        start_date: start_date,
        end_date: end_date
      });
    }).toThrow(/INVALID_START_DATE/);
  });
});