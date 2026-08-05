import { calculateCorrelationCoefficient } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-283
  test('乖離度と成約実績の相関計算で分母が0になる場合、エラーが返却される', () => {
    const deviationDataset = [0, 0, 0, 0, 0];
    const contractResultDataset = [0, 0, 0, 0, 0];

    expect(() => {
      calculateCorrelationCoefficient(deviationDataset, contractResultDataset);
    }).toThrow(/分母|相関係数|DIVISION_BY_ZERO/);
  });
});