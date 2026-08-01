import { calculateCorrelationAndDetermineCoachingTarget } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-187: 乖離度と成約実績の相関係数がちょうど1.0の場合、完全相関として判定される', () => {
    // Arrange
    const deviationScores = [10, 20, 30, 40, 50];
    const closingResults = [5, 10, 15, 20, 25];

    // Act
    const result = calculateCorrelationAndDetermineCoachingTarget({
      deviationScores,
      closingResults,
    });

    // Assert
    expect(result.correlationCoefficient).toBe(1.0);
    expect(result.judgmentStatus).toBe('完全相関');
    expect(result.determinationResult).toEqual({
      correlationLevel: '完全相関',
      requiresCoachingIntervention: false,
    });
  });
});