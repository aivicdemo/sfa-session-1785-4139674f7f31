import { describe, test, expect } from '@jest/globals';
import { generateSalesPerformanceAnalysisReport } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-548
  test('分析対象期間の終了日が日付型でない場合、エラーになる', () => {
    const salesPersonId = 'SP001';
    const startDate = new Date('2024-01-01');

    const invalidEndDates = [
      '2024-13-45',
      123456789,
      null,
      undefined,
      {},
      [],
      true,
      NaN,
    ];

    invalidEndDates.forEach((invalidEndDate) => {
      expect(() =>
        generateSalesPerformanceAnalysisReport({
          salesPersonId,
          startDate,
          endDate: invalidEndDate as any,
        })
      ).toThrow(/分析対象期間の終了日|INVALID_DATE_FORMAT/);
    });
  });
});