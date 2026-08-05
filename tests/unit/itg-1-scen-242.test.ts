import { determineCoachingPriority } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-242: スコア計算結果がない営業担当者に対して優先順位を決定しようとするときエラーになる', () => {
    // Arrange
    const nonExistentEmployeeId = 'EMP-999';

    // Act & Assert
    expect(() => {
      determineCoachingPriority(nonExistentEmployeeId);
    }).toThrow(/SCORE_NOT_FOUND/);
  });
});