import { determineExtractionPeriod } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログデータ抽出範囲確定機能', () => {
  // SCEN-120
  test('期間開始日と終了日が同一日の場合、1日間の抽出期間として正しく確定される', () => {
    const start_date = new Date('2024-01-15T00:00:00Z');
    const end_date = new Date('2024-01-15T00:00:00Z');

    const result = determineExtractionPeriod({
      start_date,
      end_date,
    });

    const expected_start = new Date('2024-01-15T00:00:00Z');
    const expected_end = new Date('2024-01-15T23:59:59Z');

    expect(result.confirmed_start_datetime).toEqual(expected_start);
    expect(result.confirmed_end_datetime).toEqual(expected_end);

    const day_count = Math.floor(
      (result.confirmed_end_datetime.getTime() - result.confirmed_start_datetime.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;
    expect(day_count).toBe(1);
  });
});