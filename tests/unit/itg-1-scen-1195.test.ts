import { calculateConversionRateCorrelation } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1195
  test('[error] 成約実績相関分析機能 - 成約率が 100 を超える値のとき処理がエラーになる', () => {
    const invalid_conversion_rate = 101;

    expect(() => {
      calculateConversionRateCorrelation({
        conversionRate: invalid_conversion_rate,
      });
    }).toThrow(/成約率/);
  });
});