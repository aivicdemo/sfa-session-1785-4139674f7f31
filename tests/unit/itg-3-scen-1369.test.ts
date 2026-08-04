import { calculateInvestmentROI } from '../../src/logic/it-1-br-3-2-1-1';

describe('投資対効果算出機能 - 投資回収期間の予測データが空のとき', () => {
  test('SCEN-1369: 投資回収期間の予測データが空のときエラーをスロー', () => {
    const initialInvestment = 1000000;
    const annualEffect = 300000;
    const paybackPeriodForecast = null;

    expect(() =>
      calculateInvestmentROI({
        initialInvestment,
        annualEffect,
        paybackPeriodForecast
      })
    ).toThrow(/投資回収期間/);
  });
});