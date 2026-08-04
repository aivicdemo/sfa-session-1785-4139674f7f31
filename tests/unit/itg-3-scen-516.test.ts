import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { validateDataQualityReportInput } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質レポート確認', () => {
  // SCEN-516
  test('改善優先度ランクが定義済み値（1、2、3）以外のときにValidationErrorが発生する', () => {
    const invalidRanks = [0, 4, -1, 999, null, undefined, 'invalid', {}, [], NaN];

    invalidRanks.forEach((invalidRank) => {
      const invalidInput = {
        dataQualityScore: 85,
        improvementItems: ['item1', 'item2'],
        priorityRank: invalidRank,
        reportId: 'report-001',
      };

      expect(() => {
        validateDataQualityReportInput(invalidInput);
      }).toThrow(/改善優先度ランク/);
    });
  });
});