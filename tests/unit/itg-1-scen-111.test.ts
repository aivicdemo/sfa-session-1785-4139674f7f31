import { describe, test, expect, beforeEach } from '@jest/globals';
import { determineExtractionPeriod } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログデータ抽出範囲確定機能', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-111
  test('抽出対象期間が月初日ちょうどで開始する場合、期間開始日が正しく確定される', () => {
    const start_date = new Date('2024-01-01T00:00:00Z');
    const end_date = new Date('2024-01-31T23:59:59Z');

    const result = determineExtractionPeriod({
      start_date,
      end_date,
    });

    expect(result.confirmed_start_date).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(result.confirmed_start_date.getFullYear()).toBe(2024);
    expect(result.confirmed_start_date.getMonth()).toBe(0);
    expect(result.confirmed_start_date.getDate()).toBe(1);
    expect(result.confirmed_start_date.getHours()).toBe(0);
    expect(result.confirmed_start_date.getMinutes()).toBe(0);
    expect(result.confirmed_start_date.getSeconds()).toBe(0);
  });
});