import { calculateProcessDeviationImpact } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-1198: プロセス乖離影響度計算機能 - 成果への影響度が null のときエラー', () => {
    const input = {
      processDeviationDegree: 0.35,
      importance: 0.8,
      impactOnAchievement: null,
      frequencyOfDeviation: 5,
      recoveryDifficulty: 0.6,
    };

    expect(() => calculateProcessDeviationImpact(input)).toThrow(/成果への影響度/);
  });
});