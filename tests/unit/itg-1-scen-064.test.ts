import { calculateExtractionDateRange } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  test('SCEN-064: [normal] 営業プロセスログ抽出範囲確定機能 - 抽出対象期間が月をまたぐとき全月のデータが範囲に含まれる', () => {
    const start_date = new Date('2024-01-15T00:00:00Z');
    const end_date = new Date('2024-02-10T00:00:00Z');

    const result = calculateExtractionDateRange({
      start_date,
      end_date,
    });

    const expected_range_start = new Date('2024-01-01T00:00:00Z');
    const expected_range_end = new Date('2024-02-29T23:59:59Z');

    expect(result.extraction_range_start).toEqual(expected_range_start);
    expect(result.extraction_range_end).toEqual(expected_range_end);
    expect(result.extraction_range_start.getTime()).toBeLessThanOrEqual(start_date.getTime());
    expect(result.extraction_range_end.getTime()).toBeGreaterThanOrEqual(end_date.getTime());
    expect(result.is_month_aligned).toBe(true);
  });
});