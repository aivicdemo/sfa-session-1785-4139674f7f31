import { selectBehaviorAnalysisIndicators } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1081
  test('相関係数が0.7未満のとき指標が選定されない', () => {
    // Arrange
    const indicators = [
      {
        id: 'indicator_a',
        name: '指標A',
        correlationCoefficient: 0.65,
      },
      {
        id: 'indicator_b',
        name: '指標B',
        correlationCoefficient: 0.72,
      },
      {
        id: 'indicator_c',
        name: '指標C',
        correlationCoefficient: 0.69,
      },
    ];
    const correlationThreshold = 0.7;

    // Act
    const selectedIndicators = selectBehaviorAnalysisIndicators(
      indicators,
      correlationThreshold
    );

    // Assert
    expect(selectedIndicators).toHaveLength(1);
    expect(selectedIndicators[0].id).toBe('indicator_b');
    expect(selectedIndicators[0].name).toBe('指標B');
    expect(selectedIndicators[0].correlationCoefficient).toBe(0.72);
  });
});