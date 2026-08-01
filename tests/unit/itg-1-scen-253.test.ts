import { getRecommendedApproachFromPatternMatrix } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-253: 成功パターンマトリクス参照による提案アプローチ判定機能 - 現在の顧客条件が欠落している場合、パターンマッチングが実行されない', () => {
    // Arrange
    const incompleteCustomerConditions = {
      industry: undefined,
      company_size: null,
      budget: undefined,
      decision_authority: null,
    };

    const mockPatternMatrixQueries: string[] = [];
    const mockErrorLogs: string[] = [];

    // Mock getRecommendedApproachFromPatternMatrix to track calls
    const originalConsoleError = console.error;
    console.error = jest.fn((message: string) => {
      mockErrorLogs.push(message);
      originalConsoleError(message);
    });

    // Act
    const result = getRecommendedApproachFromPatternMatrix(
      incompleteCustomerConditions,
      {
        onPatternMatrixQuery: () => {
          mockPatternMatrixQueries.push('query_executed');
        },
      }
    );

    // Assert
    // 1. 戻り値がnullまたはundefinedであることを検証
    expect(result).toBeNull();

    // 2. 成功パターンマトリクスへのクエリが一度も実行されなかったことを検証
    expect(mockPatternMatrixQueries).toHaveLength(0);

    // 3. エラーログに「顧客条件」というキーワードが含まれていることを検証
    const hasIncompletionError = mockErrorLogs.some((log) =>
      /顧客条件|customer.*condition/.test(log)
    );
    expect(hasIncompletionError).toBe(true);

    // Cleanup
    console.error = originalConsoleError;
  });
});