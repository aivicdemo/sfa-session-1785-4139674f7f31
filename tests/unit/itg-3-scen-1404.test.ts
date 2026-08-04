import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1404
  test('提案内容と顧客制約条件の自動照合機能 - 投資対効果の計算結果が業務上の最大規模のとき、正常に数値化される', () => {
    const maxInvestmentAmount = 99999999.99;
    const maxExpectedEffectAmount = 99999999.99;
    const maxCalculationPeriodMonths = 120;

    const investmentData = {
      investmentAmount: maxInvestmentAmount,
      expectedEffectAmount: maxExpectedEffectAmount,
      calculationPeriodMonths: maxCalculationPeriodMonths,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(99999999.99),
    };

    const result = evaluatePatternRelevance(investmentData, mockAIEngine);

    expect(typeof result).toBe('number');

    expect(isFinite(result)).toBe(true);

    expect(Number.isNaN(result)).toBe(false);

    expect(result).toBeDefined();

    expect(result).toBeLessThanOrEqual(99999999.99);

    const decimalPlaces = (result.toString().split('.')[1] || '').length;
    expect(decimalPlaces).toBeLessThanOrEqual(2);

    const roundedResult = Math.round(result * 100) / 100;
    expect(Math.abs(result - roundedResult)).toBeLessThanOrEqual(0.01);

    expect(result).toBe(99999999.99);

    const maxDecimalPrecision = 99999999.99;
    expect(result).toBeLessThanOrEqual(maxDecimalPrecision);

    const storagePrecision = Math.round(result * 100) / 100;
    expect(storagePrecision).toBe(99999999.99);
  });
});