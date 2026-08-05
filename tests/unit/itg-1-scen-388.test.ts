import { evaluateSuccessPatternMatch } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-388
  test('成功パターンマトリクス適用判定機能 - 顧客条件データが空オブジェクトのとき判定ロジックが失敗する', () => {
    // Arrange
    const empty_customer_conditions = {};

    // Act
    const result = evaluateSuccessPatternMatch(empty_customer_conditions);

    // Assert
    expect(result).toBeInstanceOf(Error);
    expect((result as Error).message).toMatch(/顧客条件データが不足しています|必須フィールドが見つかりません/);
  });
});