import { analyzeCorrelationWithRounding } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-856
  test('相関分析結果の数値に端数が生じる場合、小数点第3位で四捨五入する', () => {
    const testDataSet = [
      { deviationScore: 0.15, contractAmount: 1200000 },
      { deviationScore: 0.28, contractAmount: 950000 },
      { deviationScore: 0.42, contractAmount: 1800000 },
      { deviationScore: 0.51, contractAmount: 2100000 },
      { deviationScore: 0.08, contractAmount: 800000 },
      { deviationScore: 0.65, contractAmount: 2500000 },
      { deviationScore: 0.35, contractAmount: 1400000 },
      { deviationScore: 0.22, contractAmount: 900000 },
      { deviationScore: 0.58, contractAmount: 2200000 },
      { deviationScore: 0.41, contractAmount: 1600000 },
    ];

    const result = analyzeCorrelationWithRounding(testDataSet);

    expect(result.correlationCoefficient).toBe(0.786);
    expect(result.roundingRule).toBe('round_to_3_decimal_places');
    expect(result.originalCorrelationCoefficient).toBe(0.7856);
    expect(Array.isArray(result.calculationLog)).toBe(true);
    expect(result.calculationLog.length).toBeGreaterThan(0);

    const roundingLogEntry = result.calculationLog.find(
      (log: any) => log.type === 'rounding'
    );
    expect(roundingLogEntry).toBeDefined();
    expect(roundingLogEntry.originalValue).toBe(0.7856);
    expect(roundingLogEntry.roundedValue).toBe(0.786);
    expect(roundingLogEntry.decimalPlaces).toBe(3);

    const reportWithRounding = result.analysisReport;
    expect(reportWithRounding.correlationCoefficient).toBe(0.786);
    expect(reportWithRounding.correlationCoefficient.toString().split('.')[1].length).toBeLessThanOrEqual(3);
  });
});