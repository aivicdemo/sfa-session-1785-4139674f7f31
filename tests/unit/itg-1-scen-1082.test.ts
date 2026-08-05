import { selectAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1082: [edge] 行動パターン分析対象指標の自動選定機能 - 相関係数が 0.7 を超えるとき指標が選定される
  test('相関係数が0.71のとき、両指標が自動選定される', () => {
    const indicators = [
      {
        id: 'indicator_A',
        name: '初回接触頻度',
        correlationCoefficient: 0.71,
      },
      {
        id: 'indicator_B',
        name: '提案成功率',
        correlationCoefficient: 0.71,
      },
    ];

    const correlationThreshold = 0.7;

    const selectedIndicators = selectAnalysisIndicators(
      indicators,
      correlationThreshold
    );

    expect(selectedIndicators).toHaveLength(2);
    expect(selectedIndicators).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'indicator_A',
          name: '初回接触頻度',
          correlationCoefficient: 0.71,
        }),
        expect.objectContaining({
          id: 'indicator_B',
          name: '提案成功率',
          correlationCoefficient: 0.71,
        }),
      ])
    );
    expect(selectedIndicators[0].correlationCoefficient).toBe(0.71);
    expect(selectedIndicators[1].correlationCoefficient).toBe(0.71);
  });
});