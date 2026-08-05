import { determineExtractionRangeAndFiscalYear } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセスログデータ抽出範囲確定機能', () => {
  // SCEN-114
  test('年度をまたぐ期間の場合、開始日時・終了日時・年度情報が正しく確定される', () => {
    const input = {
      extractionStartDate: '2024-12-31',
      extractionEndDate: '2025-01-01',
    };

    const result = determineExtractionRangeAndFiscalYear(input);

    expect(result.confirmedStartDateTime).toBe('2024-12-31T00:00:00Z');
    expect(result.confirmedEndDateTime).toBe('2025-01-01T23:59:59Z');
    expect(result.fiscalYearClassification).toBe('複数年度にまたがる');
    expect(result.fiscalYearMapping).toEqual({
      startFiscalYear: '2024年度',
      endFiscalYear: '2025年度',
      logRecordFiscalYearFlag: '2024年度-2025年度',
    });
  });
});