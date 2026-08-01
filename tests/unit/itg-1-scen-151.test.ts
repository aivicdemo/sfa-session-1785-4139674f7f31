import { describe, test, expect } from '@jest/globals';
import { generateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-151
  test('乖離度が負の値のとき、エラーが発生する', () => {
    const salesPersonId = 'SP001';
    const reportPeriodStart = '2024-01-01';
    const reportPeriodEnd = '2024-01-31';
    const deviationScore = -5;

    expect(() =>
      generateBehaviorPatternAnalysisReport({
        salesPersonId,
        reportPeriodStart,
        reportPeriodEnd,
        deviationScore,
      })
    ).toThrow(/DEVIATION_NEGATIVE_VALUE/);
  });
});